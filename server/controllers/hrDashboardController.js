const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");

// Dashboard controller
async function getEmployeeRecords(req, res) {
  try {
    // Fetch all employees with their associated IdInformation
    const employeeRecords = await Employee.findAll({
      include: {
        model: IdInformation,
        attributes: ["date_expire"], // Specify the fields you want to include from IdInformation
      },
    });

    // Calculate various employee counts
    const regularEmployeeCount = employeeRecords.filter(
      (emp) => emp.employeeType === "REGULAR"
    ).length;
    const probationaryEmployeeCount = 20;
    const projectBasedEmployeeCount = employeeRecords.filter(
      (emp) => emp.employeeType === "PROJECT BASED"
    ).length;
    const totalEmployee =
      regularEmployeeCount +
      probationaryEmployeeCount +
      projectBasedEmployeeCount;

    // Calculate expired contract employees excluding 1970 and sort by date_expire
    const currentDate = new Date();
    const expiredContractEmployees = employeeRecords
      .filter((emp) => {
        const idInfo = emp.IdInformation;
        if (idInfo && idInfo.date_expire) {
          const expirationDate = new Date(idInfo.date_expire);
          // Exclude dates in 1970
          return (
            expirationDate < currentDate &&
            expirationDate.getFullYear() !== 1970
          );
        }
        return false;
      })
      .sort((a, b) => {
        const dateA = new Date(a.IdInformation.date_expire);
        const dateB = new Date(b.IdInformation.date_expire);
        return dateA - dateB; // Sort by date_expire ascending (oldest to newest)
      });

    const expiredContractEmployeeCount = expiredContractEmployees.length;

    // Calculate employee count per department
    const departmentCounts = {};
    employeeRecords.forEach((emp) => {
      console.log(emp.dataValues.department);
      const department = emp.dataValues.department;
      if (department) {
        if (!departmentCounts[department]) {
          departmentCounts[department] = 0;
        }
        departmentCounts[department]++;
      }
    });

    res.json({
      employeeRecords,
      regularEmployeeCount,
      probationaryEmployeeCount,
      projectBasedEmployeeCount,
      totalEmployee,
      expiredContractEmployeeCount,
      expiredContractEmployees,
      departmentCounts,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getEmployeeRecords,
};
