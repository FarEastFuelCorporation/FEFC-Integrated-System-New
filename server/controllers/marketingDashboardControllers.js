require("dotenv").config();
const Client = require("../models/Client");
const Quotation = require("../models/Quotation");
const QuotationWaste = require("../models/QuotationWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");
const generateClientId = require("../utils/generateClientId");

// Dashboard controller

// Get Clients controller
async function getClientsController(req, res) {
  try {
    // Fetch all clients from the database
    const clients = await Client.findAll();

    res.json({ clients });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Client controller
async function createClientController(req, res) {
  try {
    // Extracting data from the request body
    const {
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
      submittedBy,
    } = req.body;

    let clientPicture = null;
    if (req.file) {
      clientPicture = req.file.buffer;
    }

    // Generate a new client ID based on the client type
    const clientId = await generateClientId(clientType);

    // Creating a new client
    const newClient = await Client.create({
      clientId,
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
      clientPicture,
      submittedBy,
    });

    // Respond with the newly created client data
    res.status(201).json(newClient);
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update Client controller
async function updateClientController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating client with ID:", id);

    const {
      clientName,
      address,
      natureOfBusiness,
      contactNumber,
      clientType,
      billerName,
      billerAddress,
      billerContactPerson,
      billerContactNumber,
      submittedBy,
    } = req.body;

    let clientPicture = null;
    if (req.file) {
      clientPicture = req.file.buffer;
    }

    // Find the client by UUID (id) and update it
    const updatedClient = await Client.findOne({ id });

    if (updatedClient) {
      // Update client attributes
      updatedClient.clientName = clientName;
      updatedClient.address = address;
      updatedClient.natureOfBusiness = natureOfBusiness;
      updatedClient.contactNumber = contactNumber;
      updatedClient.clientType = clientType;
      updatedClient.billerName = billerName;
      updatedClient.billerAddress = billerAddress;
      updatedClient.billerContactPerson = billerContactPerson;
      updatedClient.billerContactNumber = billerContactNumber;
      updatedClient.submittedBy = submittedBy;
      updatedClient.clientPicture = clientPicture;

      // Save the updated client
      await updatedClient.save();

      // Respond with the updated client object
      res.json(updatedClient);
    } else {
      // If client with the specified ID was not found
      res.status(404).json({ message: `Client with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating client:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Client controller
async function deleteClientController(req, res) {
  try {
    const id = req.params.id;
    console.log("Soft deleting client with ID:", id);

    // Find the client by UUID (id)
    const clientToDelete = await Client.findOne({ id });

    if (clientToDelete) {
      // Soft delete the client (sets deletedAt timestamp)
      await clientToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Client with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If client with the specified ID was not found
      res.status(404).json({ message: `Client with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting client:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create Treatment Process controller
async function createTreatmentProcessController(req, res) {
  try {
    // Extracting data from the request body
    const { treatmentProcess } = req.body;

    // Creating a new client
    const newTreatmentProcess = await TreatmentProcess.create({
      treatmentProcess,
    });

    // Respond with the newly created client data
    res.status(201).json(newTreatmentProcess);
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Type Of Waste controller
async function getTypeOfWastesController(req, res) {
  try {
    // Fetch all clients from the database
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
    const { wasteCategory, wasteCode, wasteDescription, treatmentProcessId } =
      req.body;
    // Creating a new client
    const newTypeOfWaste = await TypeOfWaste.create({
      wasteCategory,
      wasteCode,
      wasteDescription,
      treatmentProcessId,
    });

    // Respond with the newly created client data
    res.status(201).json(newTypeOfWaste);
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Quotations controller
async function getQuotationsController(req, res) {
  try {
    // Fetch all clients from the database
    const quotations = await Quotation.findAll({
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
      order: [["quotationCode", "ASC"]],
    });

    console.log(quotations);

    res.json({ quotations });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Quotation controller
async function createQuotationController(req, res) {
  const {
    quotationCode,
    validity,
    clientId,
    termsCharge,
    termsBuying,
    scopeOfWork,
    remarks,
    submittedBy,
    quotationWastes, // This should be an array of quotation wastes
  } = req.body;

  try {
    // Create the quotation record
    const quotation = await Quotation.create({
      quotationCode,
      validity,
      clientId,
      termsCharge,
      termsBuying,
      scopeOfWork,
      remarks,
      submittedBy,
    });

    // Create the quotation wastes associated with this quotation
    const createdQuotationWastes = await Promise.all(
      quotationWastes.map(async (waste) => {
        const {
          wasteId,
          wasteName,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
        } = waste;

        return await QuotationWaste.create({
          quotationId: quotation.id,
          wasteId,
          wasteName,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
        });
      })
    );

    // Respond with created quotation and its wastes
    res.status(201).json({
      quotation,
      quotationWastes: createdQuotationWastes,
    });
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({ error: "Failed to create quotation" });
  }
}

// Update Quotation controller
async function updateQuotationController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating quotation with ID:", id);

    const {
      quotationCode,
      validity,
      clientId,
      termsCharge,
      termsBuying,
      scopeOfWork,
      remarks,
      quotationWastes, // This should be an array of quotation wastes
    } = req.body;

    console.log("Request body:", req.body);

    // Find the quotation by ID and update it
    const updatedQuotation = await Quotation.findByPk(id);

    if (updatedQuotation) {
      // Update quotation attributes
      updatedQuotation.quotationCode = quotationCode;
      updatedQuotation.validity = validity;
      updatedQuotation.clientId = clientId;
      updatedQuotation.termsCharge = termsCharge;
      updatedQuotation.termsBuying = termsBuying;
      updatedQuotation.scopeOfWork = scopeOfWork;
      updatedQuotation.remarks = remarks;

      // Save the updated quotation
      await updatedQuotation.save();

      // Update or create quotation wastes associated with this quotation
      const updatedQuotationWastes = await Promise.all(
        quotationWastes.map(async (waste) => {
          const {
            id: quotationWasteId, // Assuming quotationWasteId is passed for updates
            wasteId,
            wasteName,
            mode,
            unit,
            unitPrice,
            vatCalculation,
            hasFixedRate,
            fixedWeight,
            fixedPrice,
          } = waste;

          if (quotationWasteId) {
            // If quotationWasteId is provided, update existing quotation waste
            const existingQuotationWaste = await QuotationWaste.findByPk(
              quotationWasteId
            );
            if (existingQuotationWaste) {
              existingQuotationWaste.wasteId = wasteId;
              existingQuotationWaste.wasteName = wasteName;
              existingQuotationWaste.mode = mode;
              existingQuotationWaste.unit = unit;
              existingQuotationWaste.unitPrice = unitPrice;
              existingQuotationWaste.vatCalculation = vatCalculation;
              existingQuotationWaste.hasFixedRate = hasFixedRate;
              existingQuotationWaste.fixedWeight = fixedWeight;
              existingQuotationWaste.fixedPrice = fixedPrice;
              await existingQuotationWaste.save();
              return existingQuotationWaste;
            } else {
              throw new Error(
                `Quotation waste with ID ${quotationWasteId} not found`
              );
            }
          } else {
            // If quotationWasteId is not provided, create new quotation waste
            const newQuotationWaste = await QuotationWaste.create({
              quotationId: updatedQuotation.id,
              wasteId,
              wasteName,
              mode,
              unit,
              unitPrice,
              vatCalculation,
              hasFixedRate,
              fixedWeight,
              fixedPrice,
            });
            return newQuotationWaste;
          }
        })
      );

      // Respond with the updated quotation and its wastes
      res.json({
        quotation: updatedQuotation,
        quotationWastes: updatedQuotationWastes,
      });
    } else {
      // If quotation with the specified ID was not found
      res.status(404).json({ message: `Quotation with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating quotation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Quotation controller
async function deleteQuotationController(req, res) {
  try {
    const id = req.params.id;
    console.log("Soft deleting quotation with ID:", id);

    // Find the client by UUID (id)
    const quotationToDelete = await Quotation.findOne({ id });

    if (quotationToDelete) {
      // Soft delete the client (sets deletedAt timestamp)
      await quotationToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Quotation with ID ${quotationToDelete.quotationCode} soft-deleted successfully`,
      });
    } else {
      // If client with the specified ID was not found
      res.status(404).json({ message: `Client with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting client:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getClientsController,
  createClientController,
  updateClientController,
  deleteClientController,
  createTreatmentProcessController,
  getTypeOfWastesController,
  createTypeOfWasteController,
  getQuotationsController,
  createQuotationController,
  updateQuotationController,
  deleteQuotationController,
};
