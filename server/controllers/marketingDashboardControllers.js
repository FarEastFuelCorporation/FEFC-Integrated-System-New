require("dotenv").config();
const Client = require("../models/Client");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
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
      createdBy,
    } = req.body;

    let clientPicture = null;
    if (req.file) {
      clientPicture = req.file.buffer;
    }

    // Generate a new client ID based on the client type
    const clientId = await generateClientId(clientType);

    // Creating a new client
    await Client.create({
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
      createdBy,
    });

    const clients = await Client.findAll();

    // Respond with the newly created client data
    res.status(201).json({ clients });
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
      createdBy,
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
      updatedClient.updatedBy = createdBy;
      updatedClient.clientPicture = clientPicture;

      // Save the updated client
      await updatedClient.save();

      const clients = await Client.findAll();

      // Respond with the updated client object
      res.json({ clients });
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
    const { deletedBy } = req.body;

    console.log("Soft deleting client with ID:", id);

    // Find the client by UUID (id)
    const clientToDelete = await Client.findOne({ id });

    if (clientToDelete) {
      // Update the deletedBy field
      clientToDelete.updatedBy = deletedBy;
      clientToDelete.deletedBy = deletedBy;
      await clientToDelete.save();

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
          model: QuotationTransportation,
          as: "QuotationTransportation",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
      where: {
        status: "active", // Replace 'status' with your actual column name
      },
      order: [["quotationCode", "ASC"]],
    });

    res.json({ quotations });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Create Quotation controller
async function createQuotationController(req, res) {
  let {
    quotationCode,
    validity,
    clientId,
    termsCharge,
    termsBuying,
    scopeOfWork,
    remarks,
    createdBy,
    quotationWastes, // This should be an array of quotation wastes
    quotationTransportation, // This should be an array of quotation transportation
  } = req.body;

  termsCharge = termsCharge.toUpperCase();
  termsBuying = termsBuying.toUpperCase();
  scopeOfWork = scopeOfWork.toUpperCase();
  remarks = remarks.toUpperCase();

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
      createdBy,
    });

    // Create the quotation wastes associated with this quotation
    await Promise.all(
      quotationWastes.map(async (waste) => {
        let {
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

        wasteName = wasteName.toUpperCase();

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
          createdBy,
        });
      })
    );

    // Create the quotation transportation associated with this quotation
    await Promise.all(
      quotationTransportation.map(async (transportation) => {
        let {
          vehicleId,
          haulingArea,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
        } = transportation;

        haulingArea = haulingArea.toUpperCase();

        return await QuotationTransportation.create({
          quotationId: quotation.id,
          vehicleId,
          haulingArea,
          mode,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
          createdBy,
        });
      })
    );

    const quotations = await Quotation.findAll({
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
        },
        {
          model: QuotationTransportation,
          as: "QuotationTransportation",
        },
        {
          model: Client,
          as: "Client",
        },
      ],
      where: {
        status: "active", // Replace 'status' with your actual column name
      },
      order: [["quotationCode", "ASC"]],
    });

    // Respond with updated quotation and its wastes
    res.status(201).json({ quotations });
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

    let {
      quotationCode,
      validity,
      clientId,
      termsCharge,
      termsBuying,
      scopeOfWork,
      remarks,
      createdBy,
      quotationWastes, // This should be an array of quotation wastes
      quotationTransportation, // This should be an array of quotation transportation
    } = req.body;

    termsCharge = termsCharge.toUpperCase();
    termsBuying = termsBuying.toUpperCase();
    scopeOfWork = scopeOfWork.toUpperCase();
    remarks = remarks.toUpperCase();

    // Find the quotation by ID and update it
    const updatedQuotation = await Quotation.findByPk(id);
    let revisionNumber = updatedQuotation.revisionNumber;

    revisionNumber = (parseInt(revisionNumber) + 1).toString().padStart(2, "0");

    if (updatedQuotation) {
      // Update quotation attributes
      updatedQuotation.status = "inactive";

      // Save the updated quotation
      await updatedQuotation.save();

      // Create the quotation record
      const quotation = await Quotation.create({
        quotationCode,
        revisionNumber,
        validity,
        clientId,
        termsCharge,
        termsBuying,
        scopeOfWork,
        remarks,
        createdBy,
      });

      // Create the quotation wastes associated with this quotation
      await Promise.all(
        quotationWastes.map(async (waste) => {
          let {
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

          wasteName = wasteName.toUpperCase();

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
            createdBy,
          });
        })
      );

      // Create the quotation transportation associated with this quotation
      await Promise.all(
        quotationTransportation.map(async (transportation) => {
          let {
            vehicleId,
            haulingArea,
            mode,
            unit,
            unitPrice,
            vatCalculation,
            hasFixedRate,
            fixedWeight,
            fixedPrice,
          } = transportation;

          haulingArea = haulingArea.toUpperCase();

          return await QuotationTransportation.create({
            quotationId: quotation.id,
            vehicleId,
            haulingArea,
            mode,
            unit,
            unitPrice,
            vatCalculation,
            hasFixedRate,
            fixedWeight,
            fixedPrice,
            createdBy,
          });
        })
      );

      const quotations = await Quotation.findAll({
        include: [
          {
            model: QuotationWaste,
            as: "QuotationWaste",
          },
          {
            model: QuotationTransportation,
            as: "QuotationTransportation",
          },
          {
            model: Client,
            as: "Client",
          },
        ],
        where: {
          status: "active", // Replace 'status' with your actual column name
        },
        order: [["quotationCode", "ASC"]],
      });

      // Respond with the updated quotation and its wastes
      res.json({
        quotations,
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
  getQuotationsController,
  createQuotationController,
  updateQuotationController,
  deleteQuotationController,
};
