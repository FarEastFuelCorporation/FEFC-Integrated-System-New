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

// Helper function to check if a date is today
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
      order: [["createdAt", "ASC"]],
    });

    const weeklyData = {};
    let index = 0; // Initialize index for return data

    // Group by employee and week, organize by day
    results.forEach((row) => {
      const employeeId = row.employee_id;
      const employeeDetails = row.IdInformation;
      const weekNumber = getWeekNumber(new Date(row.createdAt));
      const dayOfWeek = getDayOfWeek(new Date(row.createdAt));
      const timeFormatted = new Date(row.createdAt).toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }
      );

      // Initialize week and employee structure if it doesn't exist
      if (!weeklyData[weekNumber]) {
        weeklyData[weekNumber] = {};
      }

      if (!weeklyData[weekNumber][employeeId]) {
        weeklyData[weekNumber][employeeId] = {
          id: ++index, // Increment and assign index
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

      // Handle TIME-IN and TIME-OUT entries
      if (row.status === "TIME-IN") {
        // Start a new entry for the day
        weeklyData[weekNumber][employeeId][dayLabel].push({
          timeIn: timeFormatted,
          timeOut: null, // Placeholder for TIME-OUT
        });
      } else if (row.status === "TIME-OUT") {
        // Associate this TIME-OUT with the last TIME-IN of the day
        const lastEntry = weeklyData[weekNumber][employeeId][dayLabel].find(
          (entry) => entry.timeOut === null
        );
        if (lastEntry) {
          // Only update if there is no existing TIME-OUT
          lastEntry.timeOut = timeFormatted;
        }
      }
    });

    // Convert the object into a flat array, sorted by week number in descending order
    const formattedData = Object.keys(weeklyData)
      .sort((a, b) => b - a) // Sort week numbers in descending order
      .flatMap((weekNumber) =>
        Object.values(weeklyData[weekNumber]).map((employeeData) => {
          // Format each day as a string showing multiple entries
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
                    // Only use "On Duty" or "No Time-Out" when no timeOut is found
                    return isToday(new Date())
                      ? `${timeIn} / On Duty`
                      : `${timeIn} / No Time-Out`;
                  }
                  return `${timeIn} / ${timeOut}`;
                })
                .join("; "); // Join multiple entries with semicolons
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
