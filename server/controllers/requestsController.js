// controllers/requestsController.js

const IdInformation = require("../models/IdInformation");

async function getEmployeeDetails(req, res) {
  try {
    // Assuming the user is authenticated and their ID is stored in the session
    const employeeId = req.session.user.id;
    const employeeInformation = await IdInformation.findOne({
      where: { employee_id: employeeId },
    });

    if (!employeeInformation) {
      return res.status(404).json({ error: "Employee not found" });
    }
    console.log(employeeInformation);
    res.json(employeeInformation);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getEmployeeDetails,
};
