// controllers/certificateController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const VehicleType = require("../models/VehicleType");
const { Op, literal } = require("sequelize");
const Vehicle = require("../models/Vehicle");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const SortedWasteTransaction = require("../models/SortedWasteTransaction");
const SortedScrapTransaction = require("../models/SortedScrapTransaction");
const ScrapType = require("../models/ScrapType");
const TreatedTransaction = require("../models/TreatedTransaction");
const TreatedWasteTransaction = require("../models/TreatedWasteTransaction");
const TreatmentProcess = require("../models/TreatmentProcess");
const TreatmentMachine = require("../models/TreatmentMachine");
const Attachment = require("../models/Attachment");
const TypeOfWaste = require("../models/TypeOfWaste");
const CertifiedTransaction = require("../models/CertifiedTransaction");

// Utility function to fetch finished transactions
async function fetchFinishedTransactions(id) {
  return await CertifiedTransaction.findAll({
    include: [
      {
        model: SortedTransaction,
        as: "SortedTransaction",
        attributes: {
          exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
        },
        include: [
          {
            model: ReceivedTransaction,
            as: "ReceivedTransaction",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
            include: [
              {
                model: DispatchedTransaction,
                as: "DispatchedTransaction",
                attributes: {
                  exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
                },
                include: [
                  {
                    model: ScheduledTransaction,
                    as: "ScheduledTransaction",
                    attributes: {
                      exclude: [
                        "updatedAt",
                        "updatedBy",
                        "deletedAt",
                        "deletedBy",
                      ],
                    },
                    include: [
                      {
                        model: BookedTransaction,
                        as: "BookedTransaction",
                        attributes: {
                          exclude: [
                            "updatedAt",
                            "updatedBy",
                            "deletedAt",
                            "deletedBy",
                          ],
                        },
                        include: [
                          {
                            model: QuotationWaste,
                            as: "QuotationWaste",
                            attributes: ["wasteName", "unit"],
                            include: [
                              {
                                model: TypeOfWaste,
                                as: "TypeOfWaste",
                                attributes: ["wasteCode"],
                              },
                            ],
                          },
                          {
                            model: QuotationTransportation,
                            as: "QuotationTransportation",
                            attributes: ["id", "vehicleTypeId"],
                            include: [
                              {
                                model: VehicleType,
                                as: "VehicleType",
                                attributes: ["typeOfVehicle"],
                              },
                            ],
                          },
                          {
                            model: Client,
                            as: "Client",
                            attributes: ["clientId", "clientName", "address"],
                          },
                          {
                            model: Attachment,
                            as: "Attachment",
                            include: [
                              {
                                model: Employee,
                                as: "Employee",
                                attributes: ["firstName", "lastName"],
                              },
                            ],
                            order: [["createdAt", "ASC"]],
                          },
                        ],
                      },
                      {
                        model: Employee,
                        as: "Employee",
                        attributes: ["firstName", "lastName"],
                      },
                    ],
                  },
                  {
                    model: Employee,
                    as: "EmployeeDriver",
                    attributes: ["firstName", "lastName"],
                  },
                  {
                    model: Employee,
                    as: "Employee",
                    attributes: ["firstName", "lastName"],
                  },
                  {
                    model: Vehicle,
                    as: "Vehicle",
                    attributes: ["plateNumber"],
                  },
                ],
              },
              {
                model: Employee,
                as: "Employee",
                attributes: ["firstName", "lastName"],
              },
            ],
          },
          {
            model: SortedWasteTransaction,
            as: "SortedWasteTransaction",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
            include: [
              {
                model: TreatedWasteTransaction,
                as: "TreatedWasteTransaction",
                include: [
                  {
                    model: TreatmentProcess,
                    as: "TreatmentProcess",
                  },
                  {
                    model: TreatmentMachine,
                    as: "TreatmentMachine",
                  },
                ],
              },
            ],
          },
          {
            model: SortedScrapTransaction,
            as: "SortedScrapTransaction",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
            include: [
              {
                model: ScrapType,
                as: "ScrapType",
                attributes: {
                  exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
                },
              },
            ],
          },
          {
            model: CertifiedTransaction,
            as: "CertifiedTransaction",
            attributes: {
              exclude: ["updatedAt", "updatedBy", "deletedAt", "deletedBy"],
            },
            include: [
              {
                model: Employee,
                as: "Employee",
                attributes: ["firstName", "lastName"],
              },
            ],
          },
          {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        ],
        order: [["id", "DESC"]],
      },
    ],
    where: {
      id: id,
    },
  });
}

// Get Certificate controller
async function getCertificateController(req, res) {
  try {
    const id = req.params.id;
    console.log(id);

    // Fetch pending and finished transactions
    const finishedTransactions = await fetchFinishedTransactions(id);

    res.json({ finishedTransactions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getCertificateController,
};
