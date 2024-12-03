// controllers/quotationControllers.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const Quotation = require("../models/Quotation");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");

// Create Quotation controller
async function createQuotationController(req, res) {
  let {
    quotationCode,
    validity,
    clientId,
    termsChargeDays,
    termsCharge,
    termsBuyingDays,
    termsBuying,
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
      validity,
      clientId,
      termsChargeDays,
      termsCharge,
      termsBuyingDays,
      termsBuying,
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

    // Flatten and format the data
    const flattenedData = quotations.map((item) => {
      const quotation = item.toJSON(); // Convert Sequelize object to plain JSON
      return {
        ...quotation,
        clientPicture: quotation.Client ? quotation.Client.clientPicture : null,
        clientName: quotation.Client ? quotation.Client.clientName : null,
        quotationWastes: quotation.QuotationWaste || [],
        quotationTransportation: quotation.QuotationTransportation || [],
        validity: quotation.validity
          ? new Date(quotation.validity).toISOString().split("T")[0]
          : null, // Convert timestamp to yyyy-mm-dd format
      };
    });

    // Send the formatted data
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

// Update Quotation controller
async function updateQuotationController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating quotation with ID:", id);

    let {
      quotationCode,
      validity,
      clientId,
      termsChargeDays,
      termsCharge,
      termsBuyingDays,
      termsBuying,
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
          validity,
          clientId,
          termsChargeDays,
          termsCharge,
          termsBuyingDays,
          termsBuying,
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
        updatedQuotation.validity = validity;
        updatedQuotation.termsChargeDays = termsChargeDays;
        updatedQuotation.termsCharge = termsCharge;
        updatedQuotation.termsBuyingDays = termsBuyingDays;
        updatedQuotation.termsBuying = termsBuying;
        updatedQuotation.scopeOfWork = scopeOfWork;
        updatedQuotation.contactPerson = contactPerson;
        updatedQuotation.remarks = remarks;

        // Save the updated quotation
        await updatedQuotation.save();

        // Update the quotation wastes
        await Promise.all(
          quotationWastes.map(async (waste) => {
            const {
              id,
              wasteId,
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
  getQuotationController,
  createQuotationController,
  updateQuotationController,
  deleteQuotationController,
};
