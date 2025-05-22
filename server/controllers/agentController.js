// controllers/agentController.js

const Agent = require("../models/Agent");
const generateAgentId = require("../utils/generateAgentId");

// Create Agent controller
async function createAgentController(req, res) {
  try {
    // Extracting data from the request body
    let {
      firstName,
      middleName,
      lastName,
      affix,
      gender,
      civilStatus,
      birthDate,
      mobileNo,
      emailAddress,
      permanentAddress,
      createdBy,
    } = req.body;

    const agentId = await generateAgentId();

    // Creating a new agents
    await Agent.create({
      agentId,
      firstName: firstName?.toUpperCase() || "",
      middleName: middleName?.toUpperCase() || "",
      lastName: lastName?.toUpperCase() || "",
      affix: affix?.toUpperCase() || "",
      gender,
      civilStatus,
      birthDate,
      mobileNo,
      emailAddress,
      permanentAddress: permanentAddress?.toUpperCase() || "",
      createdBy,
    });

    const agents = await Agent.findAll({
      order: [["agentId", "ASC"]],
    });

    // Respond with the updated agents data
    res.status(201).json({ agents });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Agents controller
async function getAgentsController(req, res) {
  try {
    // Fetch all agents from the database
    const agents = await Agent.findAll({
      order: [["agentId", "ASC"]],
    });

    res.json({ agents });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Agent controller
// Update Agent controller
async function updateAgentController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating agent with ID:", id);

    // Extracting data from the request body
    let {
      firstName,
      middleName,
      lastName,
      affix,
      gender,
      civilStatus,
      birthDate,
      mobileNo,
      emailAddress,
      permanentAddress,
      createdBy, // used as updatedBy
    } = req.body;

    // Find the agent by ID
    const agent = await Agent.findByPk(id);

    if (!agent) {
      return res.status(404).json({ message: `Agent with ID ${id} not found` });
    }

    // Update agent fields
    agent.firstName = firstName?.toUpperCase() || "";
    agent.middleName = middleName?.toUpperCase() || "";
    agent.lastName = lastName?.toUpperCase() || "";
    agent.affix = affix?.toUpperCase() || "";
    agent.gender = gender;
    agent.civilStatus = civilStatus;
    agent.birthDate = birthDate;
    agent.mobileNo = mobileNo;
    agent.emailAddress = emailAddress;
    agent.permanentAddress = permanentAddress?.toUpperCase() || "";
    agent.updatedBy = createdBy;

    // Save the updated agent
    await agent.save();

    const agents = await Agent.findAll({
      order: [["agentId", "ASC"]],
    });

    res.json({ agents });
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Agent controller
async function deleteAgentController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Agent with ID:", id);

    // Find the Agent by ID
    const agentsToDelete = await Agent.findByPk(id);

    if (agentsToDelete) {
      // Update the deletedBy field
      agentsToDelete.updatedBy = deletedBy;
      agentsToDelete.deletedBy = deletedBy;
      await agentsToDelete.save();

      // Soft delete the Agent (sets deletedAt timestamp)
      await agentsToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Agent with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Agent with the specified ID was not found
      res.status(404).json({ message: `Agent with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Agent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getAgentsController,
  createAgentController,
  updateAgentController,
  deleteAgentController,
};
