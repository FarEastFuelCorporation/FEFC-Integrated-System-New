require("dotenv").config();
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");

// Dashboard controller

// Get Treatment Process controller
async function getTreatmentProcessController(req, res) {
  try {
    // Fetch all treatment process from the database
    const treatmentProcesses = await TreatmentProcess.findAll();

    res.json({ treatmentProcesses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Treatment Process controller
async function createTreatmentProcessController(req, res) {
  try {
    // Extracting data from the request body
    let { treatmentProcess, createdBy } = req.body;

    treatmentProcess = treatmentProcess.toUpperCase();

    // Creating a new treatment processes
    await TreatmentProcess.create({
      treatmentProcess,
      createdBy,
    });

    const treatmentProcesses = await TreatmentProcess.findAll();

    console.log(treatmentProcesses);

    // Respond with the updated treatment processes data
    res.status(201).json({ treatmentProcesses });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Treatment Process controller
async function updateTreatmentProcessController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating treatment process with ID:", id);

    let { treatmentProcess, createdBy } = req.body;

    treatmentProcess = treatmentProcess.toUpperCase();

    // Find the treatmentProcess by ID and update it
    const updatedTreatmentProcess = await TreatmentProcess.findByPk(id);

    if (updatedTreatmentProcess) {
      // Update treatment process attributes
      updatedTreatmentProcess.treatmentProcess = treatmentProcess;
      updatedTreatmentProcess.updatedBy = createdBy;

      // Save the updated treatment process
      await updatedTreatmentProcess.save();

      const treatmentProcesses = await TreatmentProcess.findAll();

      // Respond with the updated treatment process data
      res.json({
        treatmentProcess: updatedTreatmentProcess,
        treatmentProcesses,
      });
    } else {
      // If treatment process with the specified ID was not found
      res
        .status(404)
        .json({ message: `Treatment Process with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating treatment process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Treatment Process controller
async function deleteTreatmentProcessController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Treatment Process with ID:", id);

    // Find the Treatment Process by ID
    const treatmentProcessToDelete = await TreatmentProcess.findByPk(id);

    if (treatmentProcessToDelete) {
      // Update the deletedBy field
      treatmentProcessToDelete.updatedBy = deletedBy;
      treatmentProcessToDelete.deletedBy = deletedBy;
      await treatmentProcessToDelete.save();

      // Soft delete the TreatmentProcess (sets deletedAt timestamp)
      await treatmentProcessToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Treatment Process with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Treatment Process with the specified ID was not found
      res
        .status(404)
        .json({ message: `Treatment Process with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Treatment Process:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Type Of Waste controller
async function getTypeOfWastesController(req, res) {
  try {
    // Fetch all type of waste from the database
    const typeOfWastes = await TypeOfWaste.findAll({
      include: {
        model: TreatmentProcess,
        as: "TreatmentProcess",
      },
      order: [["wasteCode", "ASC"]],
    });

    res.json({ typeOfWastes });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Type Of Waste controller
async function createTypeOfWasteController(req, res) {
  try {
    // Extracting data from the request body
    let {
      wasteCategory,
      wasteCode,
      wasteDescription,
      treatmentProcessId,
      createdBy,
    } = req.body;

    wasteCode = wasteCode.toUpperCase();
    wasteDescription = wasteDescription.toUpperCase();

    // Creating a new type of waste
    await TypeOfWaste.create({
      wasteCategory,
      wasteCode,
      wasteDescription,
      treatmentProcessId,
      createdBy,
    });

    const typeOfWastes = await TypeOfWaste.findAll({
      include: {
        model: TreatmentProcess,
        as: "TreatmentProcess",
      },
      order: [["wasteCode", "ASC"]],
    });

    // Respond with the updated type of waste data
    res.status(201).json({ typeOfWastes });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Type Of Waste controller
async function updateTypeOfWasteController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating type of waste with ID:", id);

    let {
      wasteCategory,
      wasteCode,
      wasteDescription,
      treatmentProcessId,
      createdBy,
    } = req.body;

    wasteCode = wasteCode.toUpperCase();
    wasteDescription = wasteDescription.toUpperCase();

    // Find the typeOfWaste by ID and update it
    const updatedTypeOfWaste = await TypeOfWaste.findByPk(id);

    if (updatedTypeOfWaste) {
      // Update type of waste attributes
      updatedTypeOfWaste.wasteCategory = wasteCategory;
      updatedTypeOfWaste.wasteCode = wasteCode;
      updatedTypeOfWaste.wasteDescription = wasteDescription;
      updatedTypeOfWaste.treatmentProcessId = treatmentProcessId;
      updatedTypeOfWaste.updatedBy = createdBy;

      // Save the updated type of waste
      await updatedTypeOfWaste.save();

      const typeOfWastes = await TypeOfWaste.findAll({
        include: {
          model: TreatmentProcess,
          as: "TreatmentProcess",
        },
        order: [["wasteCode", "ASC"]],
      });

      // Respond with the updated type of waste data
      res.json({
        typeOfWaste: updatedTypeOfWaste,
        typeOfWastes,
      });
    } else {
      // If type of waste with the specified ID was not found
      res
        .status(404)
        .json({ message: `Type Of Waste with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating type of waste:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Type Of Waste controller
async function deleteTypeOfWasteController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Type Of Waste with ID:", id);

    // Find the Vehicle by ID
    const typeOfWasteToDelete = await TypeOfWaste.findByPk(id);

    if (typeOfWasteToDelete) {
      // Update the deletedBy field
      typeOfWasteToDelete.updatedBy = deletedBy;
      typeOfWasteToDelete.deletedBy = deletedBy;
      await typeOfWasteToDelete.save();

      // Soft delete the TypeOfWaste (sets deletedAt timestamp)
      await typeOfWasteToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Type Of Waste with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Type Of Waste with the specified ID was not found
      res
        .status(404)
        .json({ message: `Type Of Waste with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Type Of Waste:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getTreatmentProcessController,
  createTreatmentProcessController,
  updateTreatmentProcessController,
  deleteTreatmentProcessController,
  getTypeOfWastesController,
  createTypeOfWasteController,
  updateTypeOfWasteController,
  deleteTypeOfWasteController,
};
