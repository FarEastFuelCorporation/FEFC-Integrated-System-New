// controllers/quotationControllers.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");

// Create Quotation controller
async function createQuotationController(req, res) {
  let {
    quotationCode,
    dateCreated,
    validity,
    clientId,
    termsChargeDays,
    termsCharge,
    termsBuyingDays,
    termsBuying,
    isPDC,
    termsPDCDays,
    scopeOfWork,
    contactPerson,
    remarks,
    isOneTime,
    createdBy,
    quotationWastes, // This should be an array of quotation wastes
    quotationTransportation, // This should be an array of quotation transportation
  } = req.body;

  scopeOfWork = scopeOfWork && scopeOfWork.toUpperCase();
  contactPerson = contactPerson && contactPerson.toUpperCase();
  remarks = remarks && remarks.toUpperCase();

  try {
    // Create the quotation record
    const quotation = await Quotation.create({
      quotationCode,
      dateCreated,
      validity,
      clientId,
      termsChargeDays,
      termsCharge,
      termsBuyingDays,
      termsBuying,
      isPDC,
      termsPDCDays,
      scopeOfWork,
      contactPerson,
      remarks,
      isOneTime,
      createdBy,
    });

    // Create the quotation wastes associated with this quotation
    await Promise.all(
      quotationWastes.map(async (waste) => {
        let {
          wasteId,
          treatmentProcessId,
          wasteName,
          mode,
          quantity,
          unit,
          unitPrice,
          vatCalculation,
          hasTransportation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
          isMonthly,
        } = waste;

        wasteName = wasteName && wasteName.toUpperCase();

        return await QuotationWaste.create({
          quotationId: quotation.id,
          wasteId,
          treatmentProcessId: treatmentProcessId ? treatmentProcessId : null,
          wasteName,
          mode,
          quantity,
          unit,
          unitPrice,
          vatCalculation,
          hasTransportation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
          isMonthly,
          createdBy,
        });
      })
    );

    // Create the quotation transportation associated with this quotation
    await Promise.all(
      quotationTransportation.map(async (transportation) => {
        let {
          vehicleTypeId,
          haulingArea,
          mode,
          quantity,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
          isMonthly,
        } = transportation;

        haulingArea = haulingArea && haulingArea.toUpperCase();

        return await QuotationTransportation.create({
          quotationId: quotation.id,
          vehicleTypeId,
          haulingArea,
          mode,
          quantity,
          unit,
          unitPrice,
          vatCalculation,
          hasFixedRate,
          fixedWeight,
          fixedPrice,
          isMonthly,
          createdBy,
        });
      })
    );

    const quotations = await Quotation.findAll({
      where: {
        id: quotation.id,
      },
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteCode"],
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: QuotationTransportation,
          as: "QuotationTransportation",
          include: [
            {
              model: VehicleType,
              as: "VehicleType",
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
          // attributes: { exclude: ["clientPicture"] },
        },
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: ["first_name", "middle_name", "last_name", "signature"],
        },
      ],
      where: {
        status: "active",
      },
      order: [["quotationCode", "ASC"]], // Ordering at the top level
    });

    // Respond with updated quotation and its wastes
    res.status(201).json({ quotations });
  } catch (error) {
    console.error("Error creating quotation:", error);
    res.status(500).json({ error: "Failed to create quotation" });
  }
}

// Get Quotations controller
async function getQuotationsController(req, res) {
  try {
    // Fetch all quotations from the database
    const quotations = await Quotation.findAll({
      include: [
        {
          model: Client,
          as: "Client",
          attributes: { exclude: ["clientPicture"] },
          attributes: ["clientName"],
        },
      ],
      where: {
        status: "active",
      },
      order: [["quotationCode", "ASC"]], // Ordering at the top level
    });

    // Flatten and format the data
    const flattenedData = quotations.map((item) => {
      const quotation = item.toJSON(); // Convert Sequelize object to plain JSON
      const createdDate = new Date(quotation.dateCreated);
      const validityDate = new Date(quotation.validity);
      return {
        ...quotation,
        clientName: quotation.Client ? quotation.Client.clientName : null,
        dateCreated: !isNaN(createdDate.getTime())
          ? createdDate.toISOString().split("T")[0]
          : null, // Convert valid date to yyyy-mm-dd format or null if invalid
        validity: !isNaN(validityDate.getTime())
          ? validityDate.toISOString().split("T")[0]
          : null, // Convert valid date to yyyy-mm-dd format or null if invalid
      };
    });

    // Send the formatted data
    res.json({ quotations: flattenedData });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get Quotations Full controller
async function getQuotationsFullController(req, res) {
  try {
    // Fetch all quotations from the database
    const quotations = await Quotation.findAll({
      include: [
        {
          model: Client,
          as: "Client",
          attributes: ["clientName", "clientPicture"],
        },
      ],
      where: {
        status: "active",
      },
      order: [["quotationCode", "ASC"]], // Ordering at the top level
    });

    // Flatten and format the data
    const flattenedData = quotations.map((item) => {
      const quotation = item.toJSON(); // Convert Sequelize object to plain JSON
      const clientPicture =
        quotation.Client && quotation.Client.clientPicture
          ? `data:image/png;base64,${Buffer.from(
              quotation.Client.clientPicture
            ).toString("base64")}`
          : null;

      return {
        ...quotation,
        clientPicture,
        clientName: quotation.Client ? quotation.Client.clientName : null,
        dateCreated: quotation.dateCreated
          ? new Date(quotation.dateCreated).toISOString().split("T")[0]
          : null, // Convert timestamp to yyyy-mm-dd format
        validity: quotation.validity
          ? new Date(quotation.validity).toISOString().split("T")[0]
          : null, // Convert timestamp to yyyy-mm-dd format
      };
    });

    res.json({ quotations: flattenedData });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get Quotation controller
async function getQuotationController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all clients from the database
    const quotations = await Quotation.findAll({
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteCode"],
            },
            {
              model: Quotation,
              as: "Quotation",
            },
            {
              model: TreatmentProcess,
              as: "TreatmentProcess",
              attributes: ["treatmentProcess"],
            },
          ],
          order: [
            ["wasteName", "ASC"],
            ["mode", "ASC"],
          ],
        },
        {
          model: QuotationTransportation,
          as: "QuotationTransportation",
          include: [
            {
              model: VehicleType,
              as: "VehicleType",
              order: [["typeOfVehicle", "ASC"]],
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
          attributes: { exclude: ["clientPicture"] },
        },
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: ["first_name", "middle_name", "last_name", "signature"],
        },
      ],
      where: {
        status: "active",
        clientId: id,
      },
      order: [["quotationCode", "ASC"]],
    });

    res.json({ quotations });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Quotation Full controller
async function getQuotationFullController(req, res) {
  try {
    const id = req.params.id;

    console.log(id);

    // Fetch all quotations from the database
    const quotations = await Quotation.findAll({
      include: [
        {
          model: QuotationWaste,
          as: "QuotationWaste",
          include: [
            {
              model: TypeOfWaste,
              as: "TypeOfWaste",
              attributes: ["wasteCode"],
            },
            {
              model: TreatmentProcess,
              as: "TreatmentProcess",
              attributes: ["treatmentProcess"],
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: QuotationTransportation,
          as: "QuotationTransportation",
          include: [
            {
              model: VehicleType,
              as: "VehicleType",
            },
            {
              model: Quotation,
              as: "Quotation",
            },
          ],
        },
        {
          model: Client,
          as: "Client",
          attributes: { exclude: ["clientPicture"] },
        },
        {
          model: IdInformation,
          as: "IdInformation",
          attributes: ["first_name", "middle_name", "last_name", "signature"],
        },
      ],
      where: {
        status: "active",
        id,
      },
    });

    console.log(quotations);

    res.json({ quotations });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Update Quotation controller
async function updateQuotationController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating quotation with ID:", id);

    let {
      quotationCode,
      dateCreated,
      validity,
      clientId,
      termsChargeDays,
      termsCharge,
      termsBuyingDays,
      termsBuying,
      isPDC,
      termsPDCDays,
      scopeOfWork,
      contactPerson,
      remarks,
      isOneTime,
      isRevised,
      createdBy,
      quotationWastes, // This should be an array of quotation wastes
      quotationTransportation, // This should be an array of quotation transportation
    } = req.body;

    scopeOfWork = scopeOfWork && scopeOfWork.toUpperCase();
    contactPerson = contactPerson && contactPerson.toUpperCase();
    remarks = remarks && remarks.toUpperCase();

    // Find the quotation by ID and update it
    const updatedQuotation = await Quotation.findByPk(id);
    let revisionNumber = updatedQuotation.revisionNumber;

    revisionNumber = (parseInt(revisionNumber) + 1).toString().padStart(2, "0");

    if (updatedQuotation) {
      if (isRevised) {
        // Update quotation attributes
        updatedQuotation.status = "inactive";

        // Save the updated quotation
        await updatedQuotation.save();

        // Create the quotation record
        const quotation = await Quotation.create({
          quotationCode,
          revisionNumber,
          dateCreated,
          validity,
          clientId,
          termsChargeDays,
          termsCharge,
          termsBuyingDays,
          termsBuying,
          isPDC,
          termsPDCDays,
          scopeOfWork,
          contactPerson,
          remarks,
          isOneTime,
          createdBy,
        });

        // Create the quotation wastes associated with this quotation
        await Promise.all(
          quotationWastes.map(async (waste) => {
            let {
              wasteId,
              treatmentProcessId,
              wasteName,
              mode,
              quantity,
              unit,
              unitPrice,
              vatCalculation,
              hasTransportation,
              hasFixedRate,
              fixedWeight,
              fixedPrice,
              isMonthly,
            } = waste;

            wasteName = wasteName && wasteName.toUpperCase();

            return await QuotationWaste.create({
              quotationId: quotation.id,
              wasteId,
              treatmentProcessId: treatmentProcessId
                ? treatmentProcessId
                : null,
              wasteName,
              mode,
              quantity,
              unit,
              unitPrice,
              vatCalculation,
              hasTransportation,
              hasFixedRate,
              fixedWeight,
              fixedPrice,
              isMonthly,
              createdBy,
            });
          })
        );

        // Create the quotation transportation associated with this quotation
        await Promise.all(
          quotationTransportation.map(async (transportation) => {
            let {
              vehicleTypeId,
              haulingArea,
              mode,
              quantity,
              unit,
              unitPrice,
              vatCalculation,
              hasFixedRate,
              fixedWeight,
              fixedPrice,
              isMonthly,
            } = transportation;

            haulingArea = haulingArea && haulingArea.toUpperCase();

            return await QuotationTransportation.create({
              quotationId: quotation.id,
              vehicleTypeId,
              haulingArea,
              mode,
              quantity,
              unit,
              unitPrice,
              vatCalculation,
              hasFixedRate,
              fixedWeight,
              fixedPrice,
              isMonthly,
              createdBy,
            });
          })
        );
      } else {
        // Update quotation details
        updatedQuotation.dateCreated = dateCreated;
        updatedQuotation.validity = validity;
        updatedQuotation.termsChargeDays = termsChargeDays;
        updatedQuotation.termsCharge = termsCharge;
        updatedQuotation.termsBuyingDays = termsBuyingDays;
        updatedQuotation.termsBuying = termsBuying;
        updatedQuotation.isPDC = isPDC;
        updatedQuotation.termsPDCDays = termsPDCDays;
        updatedQuotation.scopeOfWork = scopeOfWork;
        updatedQuotation.contactPerson = contactPerson;
        updatedQuotation.remarks = remarks;
        updatedQuotation.isOneTime = isOneTime;
        updatedQuotation.updatedBy = createdBy;

        // Save the updated quotation
        await updatedQuotation.save();

        const existingWastes = await QuotationWaste.findAll({
          where: { quotationId: updatedQuotation.id },
        });

        // Extract the IDs from the incoming quotationWastes
        const incomingWasteIds = quotationWastes.map((waste) => waste.id);

        // Identify and delete wastes that are no longer present in the incoming data
        await Promise.all(
          existingWastes.map(async (existingWaste) => {
            if (!incomingWasteIds.includes(existingWaste.id)) {
              // Permanently delete the waste
              await existingWaste.destroy();
            }
          })
        );

        const existingTransportations = await QuotationTransportation.findAll({
          where: { quotationId: updatedQuotation.id },
        });

        // Extract the IDs from the incoming quotationWastes
        const incomingTransportationIds = quotationTransportation.map(
          (waste) => waste.id
        );

        // Identify and delete wastes that are no longer present in the incoming data
        await Promise.all(
          existingTransportations.map(async (existingTransportation) => {
            if (
              !incomingTransportationIds.includes(existingTransportation.id)
            ) {
              // Permanently delete the waste
              await existingTransportation.destroy();
            }
          })
        );

        // Update the quotation wastes
        await Promise.all(
          quotationWastes.map(async (waste) => {
            const {
              id,
              wasteId,
              treatmentProcessId,
              wasteName,
              mode,
              quantity,
              unit,
              unitPrice,
              vatCalculation,
              hasTransportation,
              hasFixedRate,
              fixedWeight,
              fixedPrice,
              isMonthly,
            } = waste;

            const existingWaste = await QuotationWaste.findByPk(id);

            if (existingWaste) {
              // Update existing waste
              existingWaste.wasteId = wasteId;
              existingWaste.treatmentProcessId = treatmentProcessId
                ? treatmentProcessId
                : null;
              existingWaste.wasteName = wasteName && wasteName.toUpperCase();
              existingWaste.mode = mode;
              existingWaste.quantity = quantity;
              existingWaste.unit = unit;
              existingWaste.unitPrice = unitPrice;
              existingWaste.vatCalculation = vatCalculation;
              existingWaste.hasTransportation = hasTransportation;
              existingWaste.hasFixedRate = hasFixedRate;
              existingWaste.fixedWeight = fixedWeight;
              existingWaste.fixedPrice = fixedPrice;
              existingWaste.isMonthly = isMonthly;

              await existingWaste.save();
            } else {
              // Create new waste if it doesn't exist
              await QuotationWaste.create({
                quotationId: updatedQuotation.id,
                wasteId,
                treatmentProcessId: treatmentProcessId
                  ? treatmentProcessId
                  : null,
                wasteName: wasteName && wasteName.toUpperCase(),
                mode,
                quantity,
                unit,
                unitPrice,
                vatCalculation,
                hasTransportation,
                hasFixedRate,
                fixedWeight,
                fixedPrice,
                isMonthly,
                createdBy,
              });
            }
          })
        );

        // Update the quotation transportation
        await Promise.all(
          quotationTransportation.map(async (transportation) => {
            const {
              id,
              vehicleTypeId,
              haulingArea,
              mode,
              quantity,
              unit,
              unitPrice,
              vatCalculation,
              hasFixedRate,
              fixedWeight,
              fixedPrice,
              isMonthly,
            } = transportation;

            const existingTransportation =
              await QuotationTransportation.findByPk(id);

            if (existingTransportation) {
              // Update existing transportation
              existingTransportation.vehicleTypeId = vehicleTypeId;
              existingTransportation.haulingArea =
                haulingArea && haulingArea.toUpperCase();
              existingTransportation.mode = mode;
              existingTransportation.quantity = quantity;
              existingTransportation.unit = unit;
              existingTransportation.unitPrice = unitPrice;
              existingTransportation.vatCalculation = vatCalculation;
              existingTransportation.hasFixedRate = hasFixedRate;
              existingTransportation.fixedWeight = fixedWeight;
              existingTransportation.fixedPrice = fixedPrice;
              existingTransportation.isMonthly = isMonthly;

              await existingTransportation.save();
            } else {
              // Create new transportation if it doesn't exist
              await QuotationTransportation.create({
                quotationId: updatedQuotation.id,
                vehicleTypeId,
                haulingArea: haulingArea && haulingArea.toUpperCase(),
                mode,
                quantity,
                unit,
                unitPrice,
                vatCalculation,
                hasFixedRate,
                fixedWeight,
                fixedPrice,
                isMonthly,
                createdBy,
              });
            }
          })
        );
      }

      const quotations = await Quotation.findAll({
        where: {
          id: updatedQuotation.id,
        },
        include: [
          {
            model: QuotationWaste,
            as: "QuotationWaste",
            include: [
              {
                model: TypeOfWaste,
                as: "TypeOfWaste",
                attributes: ["wasteCode"],
              },
              {
                model: Quotation,
                as: "Quotation",
              },
            ],
          },
          {
            model: QuotationTransportation,
            as: "QuotationTransportation",
            include: [
              {
                model: VehicleType,
                as: "VehicleType",
              },
              {
                model: Quotation,
                as: "Quotation",
              },
            ],
          },
          {
            model: Client,
            as: "Client",
            // attributes: { exclude: ["clientPicture"] },
          },
          {
            model: IdInformation,
            as: "IdInformation",
            attributes: ["first_name", "middle_name", "last_name", "signature"],
          },
        ],
        where: {
          status: "active",
        },
        order: [["quotationCode", "ASC"]], // Ordering at the top level
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
    const quotationToDelete = await Quotation.findByPk(id);

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
  getQuotationsController,
  getQuotationsFullController,
  getQuotationController,
  getQuotationFullController,
  createQuotationController,
  updateQuotationController,
  deleteQuotationController,
};
