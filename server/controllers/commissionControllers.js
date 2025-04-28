// controllers/commissionControllers.js

const Client = require("../models/Client");
const Employee = require("../models/Employee");
const IdInformation = require("../models/IdInformation");
const CommissionWaste = require("../models/CommissionWaste");
const TreatmentProcess = require("../models/TreatmentProcess");
const TypeOfWaste = require("../models/TypeOfWaste");
const VehicleType = require("../models/VehicleType");
const QuotationWaste = require("../models/QuotationWaste");
const Quotation = require("../models/Quotation");
const Commission = require("../models/COmmission");

// Create Commission controller
async function createCommissionController(req, res) {
  let {
    commissionCode,
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
    commissionWastes, // This should be an array of commission wastes
    commissionTransportation, // This should be an array of commission transportation
  } = req.body;

  scopeOfWork = scopeOfWork && scopeOfWork.toUpperCase();
  contactPerson = contactPerson && contactPerson.toUpperCase();
  remarks = remarks && remarks.toUpperCase();

  try {
    // Create the commission record
    const commission = await Commission.create({
      commissionCode,
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

    // Create the commission wastes associated with this commission
    await Promise.all(
      commissionWastes.map(async (waste) => {
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

        return await CommissionWaste.create({
          commissionId: commission.id,
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

    const commissions = await Commission.findAll({
      where: {
        id: commission.id,
      },
      include: [
        {
          model: Quotation,
          as: "Quotation",
        },
        {
          model: CommissionWaste,
          as: "CommissionWaste",
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
              ],
            },
          ],
        },
      ],
      where: {
        status: "active",
      },
      order: [["commissionCode", "ASC"]], // Ordering at the top level
    });

    // Respond with updated commission and its wastes
    res.status(201).json({ commissions });
  } catch (error) {
    console.error("Error creating commission:", error);
    res.status(500).json({ error: "Failed to create commission" });
  }
}

// Get Commissions controller
async function getCommissionsController(req, res) {
  try {
    // Fetch all commissions from the database
    const commissions = await Commission.findAll({
      include: [
        {
          model: Quotation,
          as: "Quotation",
        },
        {
          model: CommissionWaste,
          as: "CommissionWaste",
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
              ],
            },
          ],
        },
      ],
    });

    // Send the formatted data
    res.json({ commissions });
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get Commission controller
async function getCommissionController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all clients from the database
    const commissions = await Commission.findAll({
      include: [
        {
          model: Quotation,
          as: "Quotation",
        },
        {
          model: CommissionWaste,
          as: "CommissionWaste",
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
              ],
            },
          ],
        },
      ],
      where: {
        status: "active",
        clientId: id,
      },
      order: [["commissionCode", "ASC"]],
    });

    res.json({ commissions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Commission controller
async function updateCommissionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating commission with ID:", id);

    let {
      commissionCode,
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
      commissionWastes, // This should be an array of commission wastes
      commissionTransportation, // This should be an array of commission transportation
    } = req.body;

    scopeOfWork = scopeOfWork && scopeOfWork.toUpperCase();
    contactPerson = contactPerson && contactPerson.toUpperCase();
    remarks = remarks && remarks.toUpperCase();

    // Find the commission by ID and update it
    const updatedCommission = await Commission.findByPk(id);
    let revisionNumber = updatedCommission.revisionNumber;

    revisionNumber = (parseInt(revisionNumber) + 1).toString().padStart(2, "0");

    if (updatedCommission) {
      if (isRevised) {
        // Update commission attributes
        updatedCommission.status = "inactive";

        // Save the updated commission
        await updatedCommission.save();

        // Create the commission record
        const commission = await Commission.create({
          commissionCode,
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

        // Create the commission wastes associated with this commission
        await Promise.all(
          commissionWastes.map(async (waste) => {
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

            return await CommissionWaste.create({
              commissionId: commission.id,
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

        // Create the commission transportation associated with this commission
        await Promise.all(
          commissionTransportation.map(async (transportation) => {
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

            return await CommissionTransportation.create({
              commissionId: commission.id,
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
        // Update commission details
        updatedCommission.dateCreated = dateCreated;
        updatedCommission.validity = validity;
        updatedCommission.termsChargeDays = termsChargeDays;
        updatedCommission.termsCharge = termsCharge;
        updatedCommission.termsBuyingDays = termsBuyingDays;
        updatedCommission.termsBuying = termsBuying;
        updatedCommission.isPDC = isPDC;
        updatedCommission.termsPDCDays = termsPDCDays;
        updatedCommission.scopeOfWork = scopeOfWork;
        updatedCommission.contactPerson = contactPerson;
        updatedCommission.remarks = remarks;
        updatedCommission.isOneTime = isOneTime;
        updatedCommission.updatedBy = createdBy;

        // Save the updated commission
        await updatedCommission.save();

        const existingWastes = await CommissionWaste.findAll({
          where: { commissionId: updatedCommission.id },
        });

        // Extract the IDs from the incoming commissionWastes
        const incomingWasteIds = commissionWastes.map((waste) => waste.id);

        // Identify and delete wastes that are no longer present in the incoming data
        await Promise.all(
          existingWastes.map(async (existingWaste) => {
            if (!incomingWasteIds.includes(existingWaste.id)) {
              // Permanently delete the waste
              await existingWaste.destroy();
            }
          })
        );

        const existingTransportations = await CommissionTransportation.findAll({
          where: { commissionId: updatedCommission.id },
        });

        // Extract the IDs from the incoming commissionWastes
        const incomingTransportationIds = commissionTransportation.map(
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

        // Update the commission wastes
        await Promise.all(
          commissionWastes.map(async (waste) => {
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

            const existingWaste = await CommissionWaste.findByPk(id);

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
              await CommissionWaste.create({
                commissionId: updatedCommission.id,
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

        // Update the commission transportation
        await Promise.all(
          commissionTransportation.map(async (transportation) => {
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
              await CommissionTransportation.findByPk(id);

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
              await CommissionTransportation.create({
                commissionId: updatedCommission.id,
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

      const commissions = await Commission.findAll({
        where: {
          id: updatedCommission.id,
        },
        include: [
          {
            model: Quotation,
            as: "Quotation",
          },
          {
            model: CommissionWaste,
            as: "CommissionWaste",
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
                ],
              },
            ],
          },
        ],
        where: {
          status: "active",
        },
        order: [["commissionCode", "ASC"]], // Ordering at the top level
      });

      // Respond with the updated commission and its wastes
      res.json({
        commissions,
      });
    } else {
      // If commission with the specified ID was not found
      res.status(404).json({ message: `Commission with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating commission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Commission controller
async function deleteCommissionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Soft deleting commission with ID:", id);

    // Find the client by UUID (id)
    const commissionToDelete = await Commission.findByPk(id);

    if (commissionToDelete) {
      // Soft delete the client (sets deletedAt timestamp)
      await commissionToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Commission with ID ${commissionToDelete.commissionCode} soft-deleted successfully`,
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
  getCommissionsController,
  getCommissionController,
  createCommissionController,
  updateCommissionController,
  deleteCommissionController,
};
