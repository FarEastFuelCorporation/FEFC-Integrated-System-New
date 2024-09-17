// utils/getBookedTransactions

const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const VehicleType = require("../models/VehicleType");
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
const { Op } = require("sequelize"); // Import Sequelize operators

// Reusable include structure for both functions
const getIncludeOptions = () => [
  {
    model: QuotationWaste,
    as: "QuotationWaste",
    attributes: ["wasteName"],
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
    attributes: ["clientId", "clientName"],
  },
  {
    model: ScheduledTransaction,
    as: "ScheduledTransaction",
    required: false,
    include: [
      {
        model: DispatchedTransaction,
        as: "DispatchedTransaction",
        required: false,
        include: [
          {
            model: ReceivedTransaction,
            as: "ReceivedTransaction",
            required: false,
            include: [
              {
                model: SortedTransaction,
                as: "SortedTransaction",
                required: false,
                include: [
                  {
                    model: SortedWasteTransaction,
                    as: "SortedWasteTransaction",
                    required: false,
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
];

// Get Pending Transactions (where statusId equals given value)
const getPendingTransactions = async (statusId) => {
  try {
    const bookedTransactions = await BookedTransaction.findAll({
      where: { statusId }, // Use the statusId parameter dynamically
      include: getIncludeOptions(),
      order: [["transactionId", "DESC"]],
    });

    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

// Get Finished Transactions (where statusId is greater than given value)
const getFinishedTransactions = async (statusId) => {
  try {
    const bookedTransactions = await BookedTransaction.findAll({
      where: {
        statusId: {
          [Op.gt]: statusId, // Status ID greater than the given value
        },
      },
      include: getIncludeOptions(),
      order: [["transactionId", "DESC"]],
    });

    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching finished transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

module.exports = {
  getPendingTransactions,
  getFinishedTransactions,
};
