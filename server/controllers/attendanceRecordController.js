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

async function getAttendanceRecordController(req, res) {
  try {
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
            "designation",
            "birthday",
          ],
        },
      ],
      order: [["createdAt", "ASC"]], // Sort by date for proper pairing
    });

    const attendanceMap = {};

    // First, group TIME-IN and TIME-OUT entries for each employee per day
    results.forEach((row) => {
      const employeeId = row.employee_id;
      const dayKey = new Date(row.createdAt).toDateString(); // Use day as the key to pair
      const timeFormatted = new Date(row.createdAt).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
          timeZone: "Asia/Manila",
        }
      );

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
        const lastEntry = attendanceMap[employeeId][dayKey].find(
          (entry) => entry.timeOut === null
        );
        if (lastEntry) {
          lastEntry.timeOut = timeFormatted;
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
            employee_name: `${employeeDetails.last_name}, ${employeeDetails.first_name} ${employeeDetails.middle_name}`,
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
                      ? `${timeIn} / On Duty`
                      : `${timeIn} / No Time-Out`;
                  }
                  return `${timeIn} / ${timeOut}`;
                })
                .join("; "); // Multiple pairs are joined with a semicolon
            } else {
              employeeData[dayLabel] = null; // No entries for this day
            }
          });
          return employeeData;
        })
      );

    res.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error fetching data from the database");
  }
}

module.exports = {
  getAttendanceRecordController,
};
