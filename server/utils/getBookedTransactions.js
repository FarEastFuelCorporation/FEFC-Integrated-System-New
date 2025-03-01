// utils/getBookedTransactions

const { Op } = require("sequelize"); // Import Sequelize operators
const BookedTransaction = require("../models/BookedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const TypeOfWaste = require("../models/TypeOfWaste");
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
const CertifiedTransaction = require("../models/CertifiedTransaction");
const Attachment = require("../models/Attachment");
const BilledTransaction = require("../models/BilledTransaction");
const BillingApprovalTransaction = require("../models/BillingApprovalTransaction");
const CollectedTransaction = require("../models/CollectedTransaction");
const Quotation = require("../models/Quotation");
const BillingDistributionTransaction = require("../models/BillingDistributionTransaction");
const Logistics = require("../models/Logistics");
const TransporterClient = require("../models/TransporterClient");
const WarehousedTransaction = require("../models/WarehousedTransaction");
const WarehousedTransactionItem = require("../models/WarehousedTransactionItem");
const WarehousedOutTransaction = require("../models/WarehousedOutTransaction");
const WarehousedOutTransactionItem = require("../models/WarehousedOutTransactionItem");

// Reusable include structure for both functions
const getIncludeOptions = () => [
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
    required: false,
    include: [
      {
        model: VehicleType,
        as: "VehicleType",
        attributes: ["typeOfVehicle"],
      },
    ],
  },
  {
    model: TransporterClient,
    as: "TransporterClient",
    attributes: ["clientName", "address"],
    required: false,
  },
  {
    model: Client,
    as: "Client",
  },
  {
    model: Attachment,
    as: "Attachment",
    required: false,
    attributes: { exclude: ["attachment"] },
    include: {
      model: Employee,
      as: "Employee",
      attributes: ["firstName", "lastName"],
    },
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
            include: {
              model: VehicleType,
              as: "VehicleType",
              attributes: ["typeOfVehicle"],
            },
          },
        ],
      },
      {
        model: ReceivedTransaction,
        as: "ReceivedTransaction",
        required: false,
        include: [
          {
            model: SortedTransaction,
            as: "SortedTransaction",
            required: false,
            paranoid: true,
            include: [
              {
                model: SortedWasteTransaction,
                as: "SortedWasteTransaction",
                required: false,
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
                  {
                    model: TransporterClient,
                    as: "TransporterClient",
                    attributes: ["clientName"],
                  },
                  {
                    model: TreatmentProcess,
                    as: "TreatmentProcess",
                    attributes: ["treatmentProcess"],
                  },
                  {
                    model: TreatedWasteTransaction,
                    as: "TreatedWasteTransaction",
                    required: false,
                    include: [
                      {
                        model: TreatmentMachine,
                        as: "TreatmentMachine",
                        required: false,
                        include: [
                          {
                            model: TreatmentProcess,
                            as: "TreatmentProcess",
                            required: false,
                          },
                        ],
                      },
                      {
                        model: TreatedTransaction,
                        as: "TreatedTransaction",
                        required: false,
                        paranoid: true,
                        include: {
                          model: Employee,
                          as: "Employee",
                          attributes: ["firstName", "lastName"],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                model: SortedScrapTransaction,
                as: "SortedScrapTransaction",
                required: false,
                include: {
                  model: ScrapType,
                  as: "ScrapType",
                  required: false,
                },
              },
              {
                model: TreatedTransaction,
                as: "TreatedTransaction",
                required: false,
                paranoid: true,
              },
              {
                model: Employee,
                as: "Employee",
                attributes: ["firstName", "lastName"],
              },
            ],
          },
          {
            model: WarehousedTransaction,
            as: "WarehousedTransaction",
            required: false,
            include: [
              {
                model: WarehousedTransactionItem,
                as: "WarehousedTransactionItem",
                required: false,
                include: [
                  {
                    model: WarehousedOutTransactionItem,
                    as: "WarehousedTransactionItemToOut",
                    required: false,
                    include: {
                      model: WarehousedOutTransaction,
                      as: "WarehousedOutTransaction",
                      required: false,
                    },
                  },
                  {
                    model: TreatedWasteTransaction,
                    as: "TreatedWasteTransaction",
                    required: false,
                    include: [
                      {
                        model: TreatmentMachine,
                        as: "TreatmentMachine",
                        required: false,
                        include: [
                          {
                            model: TreatmentProcess,
                            as: "TreatmentProcess",
                            required: false,
                          },
                        ],
                      },
                      {
                        model: TreatedTransaction,
                        as: "TreatedTransaction",
                        required: false,
                        paranoid: true,
                        include: {
                          model: Employee,
                          as: "Employee",
                          attributes: ["firstName", "lastName"],
                        },
                      },
                    ],
                  },
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
              {
                model: WarehousedOutTransaction,
                as: "WarehousedOutTransaction",
                required: false,
                include: [
                  {
                    model: WarehousedOutTransactionItem,
                    as: "WarehousedOutTransactionItem",
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
                model: TreatedTransaction,
                as: "TreatedTransaction",
                required: false,
                paranoid: true,
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
        model: Logistics,
        as: "Logistics",
        attributes: ["logisticsName"],
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
  },
  {
    model: BilledTransaction,
    as: "BilledTransaction",
    required: false,
    include: [
      {
        model: BillingApprovalTransaction,
        as: "BillingApprovalTransaction",
        required: false,
        include: [
          {
            model: BillingDistributionTransaction,
            as: "BillingDistributionTransaction",
            required: false,
            include: [
              {
                model: CollectedTransaction,
                as: "CollectedTransaction",
                required: false,
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
    model: CertifiedTransaction,
    as: "CertifiedTransaction",
    required: false,
    include: [
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
  },
];

const getIncludeOptionsVerify = () => [
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
    required: false,
    include: [
      {
        model: VehicleType,
        as: "VehicleType",
        attributes: ["typeOfVehicle"],
      },
    ],
  },
  {
    model: TransporterClient,
    as: "TransporterClient",
    attributes: ["clientName", "address"],
    required: false,
  },
  {
    model: Client,
    as: "Client",
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
            include: {
              model: VehicleType,
              as: "VehicleType",
              attributes: ["typeOfVehicle"],
            },
          },
        ],
      },
      {
        model: ReceivedTransaction,
        as: "ReceivedTransaction",
        required: false,
        include: [
          {
            model: SortedTransaction,
            as: "SortedTransaction",
            required: false,
            paranoid: true,
            include: [
              {
                model: SortedWasteTransaction,
                as: "SortedWasteTransaction",
                required: false,
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
                  {
                    model: TransporterClient,
                    as: "TransporterClient",
                    attributes: ["clientName"],
                  },
                  {
                    model: TreatmentProcess,
                    as: "TreatmentProcess",
                    attributes: ["treatmentProcess"],
                  },
                  {
                    model: TreatedWasteTransaction,
                    as: "TreatedWasteTransaction",
                    required: false,
                    include: [
                      {
                        model: TreatmentMachine,
                        as: "TreatmentMachine",
                        required: false,
                        include: [
                          {
                            model: TreatmentProcess,
                            as: "TreatmentProcess",
                            required: false,
                          },
                        ],
                      },
                      {
                        model: TreatedTransaction,
                        as: "TreatedTransaction",
                        required: false,
                        paranoid: true,
                        include: {
                          model: Employee,
                          as: "Employee",
                          attributes: ["firstName", "lastName"],
                        },
                      },
                    ],
                  },
                ],
              },
              {
                model: SortedScrapTransaction,
                as: "SortedScrapTransaction",
                required: false,
                include: {
                  model: ScrapType,
                  as: "ScrapType",
                  required: false,
                },
              },
              {
                model: TreatedTransaction,
                as: "TreatedTransaction",
                required: false,
                paranoid: true,
              },
              {
                model: Employee,
                as: "Employee",
                attributes: ["firstName", "lastName"],
              },
            ],
          },
          {
            model: WarehousedTransaction,
            as: "WarehousedTransaction",
            required: false,
            include: [
              {
                model: WarehousedTransactionItem,
                as: "WarehousedTransactionItem",
                required: false,
                include: [
                  {
                    model: WarehousedOutTransactionItem,
                    as: "WarehousedTransactionItemToOut",
                    required: false,
                    include: {
                      model: WarehousedOutTransaction,
                      as: "WarehousedOutTransaction",
                      required: false,
                    },
                  },
                  {
                    model: TreatedWasteTransaction,
                    as: "TreatedWasteTransaction",
                    required: false,
                    include: [
                      {
                        model: TreatmentMachine,
                        as: "TreatmentMachine",
                        required: false,
                        include: [
                          {
                            model: TreatmentProcess,
                            as: "TreatmentProcess",
                            required: false,
                          },
                        ],
                      },
                      {
                        model: TreatedTransaction,
                        as: "TreatedTransaction",
                        required: false,
                        paranoid: true,
                        include: {
                          model: Employee,
                          as: "Employee",
                          attributes: ["firstName", "lastName"],
                        },
                      },
                    ],
                  },
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
              {
                model: WarehousedOutTransaction,
                as: "WarehousedOutTransaction",
                required: false,
                include: [
                  {
                    model: WarehousedOutTransactionItem,
                    as: "WarehousedOutTransactionItem",
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
                model: TreatedTransaction,
                as: "TreatedTransaction",
                required: false,
                paranoid: true,
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
        model: Logistics,
        as: "Logistics",
        attributes: ["logisticsName"],
      },
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
  },
  {
    model: BilledTransaction,
    as: "BilledTransaction",
    required: false,
    include: [
      {
        model: BillingApprovalTransaction,
        as: "BillingApprovalTransaction",
        required: false,
        include: [
          {
            model: BillingDistributionTransaction,
            as: "BillingDistributionTransaction",
            required: false,
            include: [
              {
                model: CollectedTransaction,
                as: "CollectedTransaction",
                required: false,
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
    model: CertifiedTransaction,
    as: "CertifiedTransaction",
    required: false,
    include: [
      {
        model: Employee,
        as: "Employee",
        attributes: ["firstName", "lastName"],
      },
    ],
  },
];

const getIncludeOptionsPartial = () => [
  {
    model: QuotationWaste,
    as: "QuotationWaste",
    attributes: ["wasteName"],
  },
  {
    model: QuotationTransportation,
    as: "QuotationTransportation",
    required: false,
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
    attributes: ["clientName", "address"],
  },
  {
    model: ScheduledTransaction,
    as: "ScheduledTransaction",
    required: false,
    attributes: ["logisticsId", "scheduledDate", "scheduledTime"],
    include: [
      {
        model: ReceivedTransaction,
        as: "ReceivedTransaction",
        required: false,
        attributes: ["submitTo"],
      },
    ],
  },
  {
    model: BilledTransaction,
    as: "BilledTransaction",
    attributes: ["billingNumber"],
    required: false,
    include: [
      {
        model: BillingApprovalTransaction,
        as: "BillingApprovalTransaction",
        attributes: ["id"],
        required: false,
        include: [
          {
            model: BillingDistributionTransaction,
            as: "BillingDistributionTransaction",
            attributes: ["id"],
            required: false,
            include: [
              {
                model: CollectedTransaction,
                as: "CollectedTransaction",
                attributes: ["id", "collectedAmount"],
                required: false,
              },
            ],
          },
        ],
      },
    ],
  },
];

// Get Pending Transactions (where statusId equals given value)
const getPendingTransactions = async (
  statusId,
  user = null,
  additionalStatusId = null,
  transactionId = null,
  partial = true
) => {
  try {
    // Build the where clause dynamically
    const whereConditions = {
      [Op.or]: [
        { statusId }, // Matches the main statusId
        additionalStatusId ? { statusId: additionalStatusId } : null, // Optionally matches an additional statusId
      ].filter(Boolean), // Filter out nulls if additionalStatusId is not provided
    };
    // If user is provided, add user-specific condition (e.g., createdBy)
    if (user) {
      whereConditions.createdBy = user;
    }
    if (transactionId) {
      whereConditions.transactionId = transactionId;
    }
    console.log(whereConditions);

    const queryOptions = {
      where: whereConditions,
      order: [["haulingDate", "DESC"]],
    };

    if (partial) {
      queryOptions.include = getIncludeOptionsPartial();
    } else {
      queryOptions.include = getIncludeOptions();
    }

    console.log(queryOptions);

    const bookedTransactions = await BookedTransaction.findAll(queryOptions);

    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

// Get In Progress Transactions (where statusId is greater than given value)
const getInProgressTransactions = async (
  statusId,
  user = null,
  additionalStatusId = null,
  transactionId = null,
  partial = true
) => {
  try {
    // Build the base where conditions
    const whereConditions = {
      statusId: {
        [Op.gt]: additionalStatusId ? additionalStatusId : statusId,
        [Op.lt]: 13,
      },
    };

    // If user is provided, add the condition for createdBy (or whatever the user field is)
    if (user) {
      whereConditions.createdBy = user;
    }
    if (transactionId) {
      whereConditions.transactionId = transactionId;
    }

    const queryOptions = {
      where: whereConditions,
      order: [["transactionId", "DESC"]],
    };

    if (partial) {
      queryOptions.include = getIncludeOptionsPartial();
    } else {
      queryOptions.include = getIncludeOptions();
    }

    const bookedTransactions = await BookedTransaction.findAll(queryOptions);
    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching in progress transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

// Get In Finished Transactions (where statusId is greater than given value)
const getFinishedTransactions = async (
  statusId,
  user = null,
  additionalStatusId = null,
  transactionId = null,
  partial = true
) => {
  try {
    // Build the base where conditions
    const whereConditions = { statusId: 13 };

    // If user is provided, add the condition for createdBy (or whatever the user field is)
    if (user) {
      whereConditions.createdBy = user;
    }
    if (transactionId) {
      whereConditions.transactionId = transactionId;
    }

    const queryOptions = {
      where: whereConditions,
      order: [["transactionId", "DESC"]],
    };

    if (partial) {
      queryOptions.include = getIncludeOptionsPartial();
    } else {
      queryOptions.include = getIncludeOptions();
    }

    const bookedTransactions = await BookedTransaction.findAll(queryOptions);

    return bookedTransactions;
  } catch (error) {
    console.error("Error fetching in progress transactions:", error);
    throw error; // Re-throw error to handle it in the calling function
  }
};

const fetchData = async (
  statusId,
  user = null,
  additionalStatusId = null,
  transactionId = null,
  partial = true
) => {
  try {
    // Fetch all transactions concurrently
    const [pendingTransactions, inProgressTransactions, finishedTransactions] =
      await Promise.all([
        getPendingTransactions(
          statusId,
          user,
          additionalStatusId,
          transactionId,
          partial
        ),
        getInProgressTransactions(
          statusId,
          user,
          additionalStatusId,
          transactionId,
          partial
        ),
        getFinishedTransactions(
          statusId,
          user,
          additionalStatusId,
          transactionId,
          partial
        ),
      ]);

    // Return the results as an object or process them as needed
    return {
      pending: pendingTransactions,
      inProgress: inProgressTransactions,
      finished: finishedTransactions,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const fetchDataFull = async (id) => {
  try {
    const transaction = await BookedTransaction.findByPk(id, {
      include: getIncludeOptions(),
      order: [
        ["transactionId", "DESC"], // This orders BookedTransaction records by id in descending order.
      ],
    });

    // Return the results as an object or process them as needed
    return {
      transaction,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const fetchDataFullMultiple = async (ids) => {
  try {
    const transactions = await BookedTransaction.findAll({
      where: { transactionId: ids }, // Fetch records matching the provided IDs
      include: getIncludeOptions(),
      order: [
        ["transactionId", "DESC"], // Order records by transactionId in descending order
      ],
    });

    // Return the fetched transactions
    return {
      transactions,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

module.exports = {
  fetchData,
  fetchDataFull,
  fetchDataFullMultiple,
  getIncludeOptions,
  getIncludeOptionsVerify,
};
