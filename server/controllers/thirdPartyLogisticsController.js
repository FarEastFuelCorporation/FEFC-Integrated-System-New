// controllers/thirdPartyLogisticsController.js

const ThirdPartyLogistics = require("../models/ThirdPartyLogistics");
const generateThirdPartyLogisticsId = require("../utils/generateThirdPartyLogisticsId");

// Create Third Party Logistics controller
async function createThirdPartyLogisticsController(req, res) {
  try {
    // Extracting data from the request body
    let { tplName, address, contactNumber, createdBy } = req.body;

    tplName = tplName.toUpperCase();
    address = address.toUpperCase();

    const tplId = await generateThirdPartyLogisticsId();

    // Creating a new third party logistics
    await ThirdPartyLogistics.create({
      tplId,
      tplName,
      address,
      contactNumber,
      createdBy,
    });

    const thirdPartyLogistics = await ThirdPartyLogistics.findAll({
      order: [["tplId", "ASC"]],
    });

    // Respond with the updated third party logistics data
    res.status(201).json({ thirdPartyLogistics });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Third Party Logistics controller
async function getThirdPartyLogisticsController(req, res) {
  try {
    // Fetch all thirdPartyLogistics from the database
    const thirdPartyLogistics = await ThirdPartyLogistics.findAll({
      order: [["tplId", "ASC"]],
    });

    res.json({ thirdPartyLogistics });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Third Party Logistics controller
async function updateThirdPartyLogisticsController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating third party logistics with ID:", id);

    let { tplName, address, contactNumber, createdBy } = req.body;

    tplName = tplName.toUpperCase();
    address = address.toUpperCase();

    // Find the third party logistics by ID and update it
    const updatedThirdPartyLogistics = await ThirdPartyLogistics.findByPk(id);

    if (updatedThirdPartyLogistics) {
      // Update third party logistics attributes
      updatedThirdPartyLogistics.tplName = tplName;
      updatedThirdPartyLogistics.address = address;
      updatedThirdPartyLogistics.contactNumber = contactNumber;
      updatedThirdPartyLogistics.updatedBy = createdBy;

      // Save the updated third party logistics
      await updatedThirdPartyLogistics.save();

      const thirdPartyLogistics = await ThirdPartyLogistics.findAll({
        order: [["tplId", "ASC"]],
      });
      // Respond with the updated third party logistics data
      res.json({ thirdPartyLogistics });
    } else {
      // If third party logistics with the specified ID was not found
      res
        .status(404)
        .json({ message: `Third Party Logistics with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating third party logistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Third Party Logistics controller
async function deleteThirdPartyLogisticsController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting ThirdPartyLogistics with ID:", id);

    // Find the ThirdPartyLogistics by ID
    const thirdPartyLogisticsToDelete = await ThirdPartyLogistics.findByPk(id);

    if (thirdPartyLogisticsToDelete) {
      // Update the deletedBy field
      thirdPartyLogisticsToDelete.updatedBy = deletedBy;
      thirdPartyLogisticsToDelete.deletedBy = deletedBy;
      await thirdPartyLogisticsToDelete.save();

      // Soft delete the ThirdPartyLogistics (sets deletedAt timestamp)
      await thirdPartyLogisticsToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `ThirdPartyLogistics with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If ThirdPartyLogistics with the specified ID was not found
      res
        .status(404)
        .json({ message: `ThirdPartyLogistics with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting ThirdPartyLogistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getThirdPartyLogisticsController,
  createThirdPartyLogisticsController,
  updateThirdPartyLogisticsController,
  deleteThirdPartyLogisticsController,
};
