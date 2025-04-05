const { Op } = require("sequelize");
const Attendance = require("../models/Attendance");
const IdInformation = require("../models/IdInformation");

function getWeekNumber(date) {
  const currentDate = new Date(date.getTime());
  currentDate.setHours(0, 0, 0, 0); // Ensure it's at midnight
  currentDate.setDate(
    currentDate.getDate() + 3 - ((currentDate.getDay() + 6) % 7)
  );
  const week1 = new Date(currentDate.getFullYear(), 0, 4);
  return Math.ceil(((currentDate - week1) / 86400000 + week1.getDay() + 1) / 7);
}

function getDayOfWeek(date) {
  const day = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
  return day === 0 ? 6 : day - 1; // Convert 0 (Sunday) to 6, shift others
}

function isToday(date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Helper function to get the start and end dates of a specific week in a given year
function getWeekDateRange(year, weekNumber) {
  const startDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6); // Set to the last day of the week
  return { startDate, endDate };
}

// Helper function to get the current week number of the year
function getWeekNumber(date) {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + 1) / 7);
}

async function getAttendanceRecordsController(req, res) {
  try {
    // Extract year and weekNumber from query parameters
    const { year, weekNumber } = req.query;

    // Get the current date
    const currentDate = new Date();

    // If year or weekNumber is not provided, use the current year and week
    const targetYear = year || currentDate.getFullYear();
    const targetWeekNumber = weekNumber || getWeekNumber(currentDate);

    // Calculate the start and end dates of the target week
    const { startDate, endDate } = getWeekDateRange(
      targetYear,
      targetWeekNumber
    );

    // Fetch attendance records within the target week
    const results = await Attendance.findAll({
      include: [
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: [
            "employee_id",
            "first_name",
            "middle_name",
            "last_name",
            "affix",
            "designation",
            "birthday",
          ],
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      },
      order: [["createdAt", "ASC"]], // Sort by date for proper pairing
    });

    // Process the results as needed
    const attendanceMap = {};

    // First, group TIME-IN and TIME-OUT entries for each employee per day
    results.forEach((row) => {
      const employeeId = row.employee_id;
      const date = new Date(row.createdAt);

      // Format the dayKey using Asia/Manila timezone
      const dayKey = date.toLocaleDateString("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      const dateFormatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Manila",
      });

      // Format the time in the same timezone
      const timeFormatted = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Manila",
      });

      if (!attendanceMap[employeeId]) {
        attendanceMap[employeeId] = {};
      }

      if (!attendanceMap[employeeId][dayKey]) {
        attendanceMap[employeeId][dayKey] = [];
      }

      if (row.status === "TIME-IN") {
        attendanceMap[employeeId][dayKey].push({
          timeIn: `${dateFormatted} ${timeFormatted}`,
          timeOut: null,
        });
      } else if (row.status === "TIME-OUT") {
        let paired = false;

        // Check the current day and all previous days for unpaired TIME-IN
        const allDays = Object.keys(attendanceMap[employeeId]).sort().reverse(); // Get all days sorted in reverse (most recent first)

        for (const previousDayKey of allDays) {
          const currentEntries = attendanceMap[employeeId][previousDayKey];
          const lastEntry = currentEntries.find(
            (entry) => entry.timeOut === null
          );

          if (lastEntry) {
            // Pair the TIME-OUT with the unpaired TIME-IN
            lastEntry.timeOut = `${dateFormatted} ${timeFormatted}`;
            paired = true;
            break; // Exit the loop once paired
          }
        }

        // If for some reason no unpaired TIME-IN was found, log an error or handle it
        if (!paired) {
          console.warn(`No unpaired TIME-IN found for employee ${employeeId}`);
        }
      }
    });

    const weeklyData = {};
    let index = 0;

    // Now group by week and organize by day
    Object.keys(attendanceMap).forEach((employeeId) => {
      Object.keys(attendanceMap[employeeId]).forEach((dayKey) => {
        const date = new Date(dayKey);
        const weekNumber = getWeekNumber(date);
        const dayOfWeek = getDayOfWeek(date);
        const employeeRecords = attendanceMap[employeeId][dayKey];

        // Initialize week and employee structure if it doesn't exist
        if (!weeklyData[weekNumber]) {
          weeklyData[weekNumber] = {};
        }

        if (!weeklyData[weekNumber][employeeId]) {
          const employeeDetails = results.find(
            (row) => row.employee_id === employeeId
          ).IdInformation;
          weeklyData[weekNumber][employeeId] = {
            id: ++index,
            weekNumber,
            employee_id: employeeDetails.employee_id,
            employee_name: `${employeeDetails.last_name}, ${employeeDetails.first_name} ${employeeDetails.affix} ${employeeDetails.middle_name}`,
            designation: employeeDetails.designation,
            birthday: employeeDetails.birthday,
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          };
        }

        const dayLabels = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const dayLabel = dayLabels[dayOfWeek];

        employeeRecords.forEach(({ timeIn, timeOut }) => {
          weeklyData[weekNumber][employeeId][dayLabel].push({
            timeIn,
            timeOut,
          });
        });
      });
    });

    // Format the final output
    const formattedData = Object.keys(weeklyData)
      .sort((a, b) => b - a)
      .flatMap((weekNumber) =>
        Object.values(weeklyData[weekNumber]).map((employeeData) => {
          const dayLabels = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          dayLabels.forEach((dayLabel) => {
            if (employeeData[dayLabel].length > 0) {
              employeeData[dayLabel] = employeeData[dayLabel]
                .map(({ timeIn, timeOut }) => {
                  if (timeOut === null) {
                    return isToday(new Date())
                      ? `${timeIn} - On Duty`
                      : `${timeIn} - No Time-Out`;
                  }
                  return `${timeIn} - ${timeOut}`;
                })
                .join("; "); // Multiple pairs are joined with a semicolon
            } else {
              employeeData[dayLabel] = null; // No entries for this day
            }
          });
          return employeeData;
        })
      );

    res.json({ data: formattedData, results });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function getAttendanceRecordController(req, res) {
  try {
    const id = req.params.id;

    const results = await Attendance.findAll({
      where: {
        employee_id: id, // Filter by employee_id
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({ results });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

async function getAttendanceRecordSubordinatesController(req, res) {
  try {
    const id = req.params.id;

    // Step 1: Find all subordinates based on the immediateHeadId
    const subordinates = await IdInformation.findAll({
      where: {
        immediateHeadId: {
          [Op.or]: [
            { [Op.like]: `${id},%` }, // id at the start
            { [Op.like]: `%,${id},%` }, // id in the middle
            { [Op.like]: `%,${id}` }, // id at the end
            { [Op.like]: `${id}` }, // id is the only value
          ],
        },
      },
      attributes: [
        "employee_id",
        "first_name",
        "middle_name",
        "last_name",
        "affix",
        "designation",
        "birthday",
      ],
    });

    // Extract subordinate IDs from the result
    const subordinateIds = subordinates.map(
      (subordinate) => subordinate.employee_id
    );

    // Step 2: Find attendance records for the specific subordinate IDs (LEFT JOIN)
    const results = await Attendance.findAll({
      where: {
        employee_id: {
          [Op.in]: subordinateIds, // Only get attendance for these subordinate IDs
        },
      },
      include: [
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: [
            "employee_id",
            "first_name",
            "middle_name",
            "last_name",
            "affix",
            "designation",
            "birthday",
          ],
        },
      ],
      order: [["createdAt", "ASC"]],
      right: true, // Ensure to include IdInformation rows without attendance
    });

    const attendanceMap = {};

    // Step 3: Process attendance records and include employees without attendance
    subordinates.forEach((subordinate) => {
      const employeeId = subordinate.employee_id;
      attendanceMap[employeeId] = {}; // Initialize with empty attendance for every employee
    });

    // First, group TIME-IN and TIME-OUT entries for each employee per day
    results.forEach((row) => {
      const employeeId = row.employee_id;
      const date = new Date(row.createdAt);

      // Format the dayKey using Asia/Manila timezone
      const dayKey = date.toLocaleDateString("en-US", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      });

      // Format the time in the same timezone
      const timeFormatted = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        timeZone: "Asia/Manila",
      });

      if (!attendanceMap[employeeId]) {
        attendanceMap[employeeId] = {};
      }

      if (!attendanceMap[employeeId][dayKey]) {
        attendanceMap[employeeId][dayKey] = [];
      }

      if (row.status === "TIME-IN") {
        attendanceMap[employeeId][dayKey].push({
          timeIn: timeFormatted,
          timeOut: null,
        });
      } else if (row.status === "TIME-OUT") {
        // Pair this TIME-OUT with the last TIME-IN that doesn't have a TIME-OUT yet
        let paired = false;
        // Check the current day
        const currentEntries = attendanceMap[employeeId][dayKey];
        const lastEntry = currentEntries?.find(
          (entry) => entry.timeOut === null
        );

        if (lastEntry) {
          lastEntry.timeOut = timeFormatted;
          paired = true;
        }

        // If no pairing happened, check the previous day
        if (!paired) {
          const previousDay = new Date(dayKey);
          previousDay.setDate(previousDay.getDate() - 1); // Go back one day
          const previousDayKey = previousDay.toLocaleDateString("en-US", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          const previousEntries = attendanceMap[employeeId][previousDayKey];
          const lastPrevEntry = previousEntries?.find(
            (entry) => entry.timeOut === null
          );
          if (lastPrevEntry) {
            lastPrevEntry.timeOut = timeFormatted;
          }
        }
      }
    });

    console.log(attendanceMap);

    const weeklyData = {};
    let index = 0;

    // Now group by week and organize by day
    Object.keys(attendanceMap).forEach((employeeId) => {
      const employee = subordinates.find(
        (subordinate) => subordinate.employee_id === employeeId
      );
      Object.keys(attendanceMap[employeeId]).forEach((dayKey) => {
        const date = new Date(dayKey);
        const weekNumber = getWeekNumber(date);
        const dayOfWeek = getDayOfWeek(date);
        const employeeRecords = attendanceMap[employeeId][dayKey];

        // Initialize week and employee structure if it doesn't exist
        if (!weeklyData[weekNumber]) {
          weeklyData[weekNumber] = {};
        }

        if (!weeklyData[weekNumber][employeeId]) {
          weeklyData[weekNumber][employeeId] = {
            id: ++index,
            weekNumber,
            employee_id: employee.employee_id,
            employee_name: `${employee.last_name}, ${employee.first_name} ${employee.affix} ${employee.middle_name}`,
            designation: employee.designation,
            birthday: employee.birthday,
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: [],
          };
        }

        const dayLabels = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];
        const dayLabel = dayLabels[dayOfWeek];

        employeeRecords.forEach(({ timeIn, timeOut }) => {
          weeklyData[weekNumber][employeeId][dayLabel].push({
            timeIn,
            timeOut,
          });
        });
      });
    });

    console.log(weeklyData);

    // Format the final output
    const formattedData = Object.keys(weeklyData)
      .sort((a, b) => b - a)
      .flatMap((weekNumber) =>
        Object.values(weeklyData[weekNumber]).map((employeeData) => {
          const dayLabels = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];

          dayLabels.forEach((dayLabel) => {
            if (
              !employeeData[dayLabel] ||
              employeeData[dayLabel].length === 0
            ) {
            } else {
              // Format the attendance data for days that have records
              employeeData[dayLabel] = employeeData[dayLabel]
                .map(({ timeIn, timeOut }) => {
                  if (timeOut === null) {
                    return isToday(new Date())
                      ? `${timeIn} / On Duty`
                      : `${timeIn} / No Time-Out`;
                  }
                  return `${timeIn} / ${timeOut}`;
                })
                .join("; "); // Multiple pairs are joined with a semicolon
            }
          });

          return employeeData;
        })
      );

    // After constructing formattedData, ensure all subordinates are included
    subordinates.forEach((subordinate) => {
      const employeeId = subordinate.employee_id;

      // Check if the employee_id exists in formattedData
      const existingEmployee = formattedData.find(
        (employeeData) => employeeData.employee_id === employeeId
      );

      // If the employee is not present in the formattedData, add a default empty record
      if (!existingEmployee) {
        let weekNumber = null;

        // Try to get the weekNumber from a co-employee in the same formattedData
        const coEmployee = formattedData.find(
          (employeeData) => employeeData.weekNumber !== null
        );

        if (coEmployee) {
          weekNumber = coEmployee.weekNumber; // Get the weekNumber from a co-employee
        }

        const emptyAttendanceRecord = {
          id: ++index,
          weekNumber: weekNumber, // Assign the same weekNumber as the co-employee
          employee_id: employeeId,
          employee_name: `${subordinate.last_name}, ${subordinate.first_name} ${subordinate.affix} ${subordinate.middle_name}`,
          designation: subordinate.designation,
          birthday: subordinate.birthday,
          Monday: "",
          Tuesday: "",
          Wednesday: "",
          Thursday: "",
          Friday: "",
          Saturday: "",
          Sunday: "",
        };

        // Push the empty attendance record into formattedData
        formattedData.push(emptyAttendanceRecord);
      }
    });

    // Sort the final formattedData (if necessary)
    formattedData.sort((a, b) => a.employee_id - b.employee_id); // Sorting by employee_id

    // Send the final response with the updated formattedData
    res.json({ data: formattedData, attendanceMap, results });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

module.exports = {
  getAttendanceRecordsController,
  getAttendanceRecordController,
  getAttendanceRecordSubordinatesController,
};
