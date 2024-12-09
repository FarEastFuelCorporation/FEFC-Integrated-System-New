// controllers/bookedTransactionController.js

const { Op } = require("sequelize");
const Decimal = require("decimal.js");
const BookedTransaction = require("../models/BookedTransaction");
const generateTransactionId = require("../utils/generateTransactionId");
const { fetchData, fetchDataFull } = require("../utils/getBookedTransactions");
const BilledTransaction = require("../models/BilledTransaction");
const QuotationWaste = require("../models/QuotationWaste");
const QuotationTransportation = require("../models/QuotationTransportation");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const ReceivedTransaction = require("../models/ReceivedTransaction");
const SortedTransaction = require("../models/SortedTransaction");
const SortedWasteTransaction = require("../models/SortedWasteTransaction");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const Quotation = require("../models/Quotation");
const BillingApprovalTransaction = require("../models/BillingApprovalTransaction");
const BillingDistributionTransaction = require("../models/BillingDistributionTransaction");
const CollectedTransaction = require("../models/CollectedTransaction");
const sendEmail = require("../sendEmail");
const VehicleType = require("../models/VehicleType");
const Client = require("../models/Client");
const { BookedTransactionEmailFormat } = require("../utils/emailFormat");
const DispatchedTransaction = require("../models/DispatchedTransaction");
const statusId = 1;

// Create Booked Transaction controller
async function createBookedTransactionController(req, res) {
  try {
    // Extracting data from the request body
    let {
      transporterClientId,
      quotationWasteId,
      quotationTransportationId,
      haulingDate,
      haulingTime,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    const transactionId = await generateTransactionId();

    const transactionData = {
      transactionId,
      quotationWasteId,
      haulingDate,
      haulingTime,
      statusId,
      createdBy,
    };

    console.log(req.body);
    console.log("quotationTransportationId", quotationTransportationId);

    if (quotationTransportationId && quotationTransportationId !== "") {
      console.log("pass");
      transactionData.quotationTransportationId = quotationTransportationId;
    }

    if (transporterClientId) {
      const concatenatedString = transporterClientId.join(". ");

      transactionData.transporterClientId = concatenatedString;
    }

    console.log("transactionData", transactionData);

    // Create the new transaction
    await BookedTransaction.create(transactionData);

    // fetch transactions
    const newTransaction = await fetchData(statusId, null, null, transactionId);

    const quotationWaste = await QuotationWaste.findByPk(quotationWasteId, {
      attributes: ["wasteName"],
    });

    const quotationTransportation = await QuotationTransportation.findByPk(
      quotationTransportationId,
      {
        attributes: ["vehicleTypeId"],
        include: {
          model: VehicleType,
          as: "VehicleType",
          attributes: ["typeOfVehicle"],
        },
      }
    );

    const bookedTransaction = await BookedTransaction.findOne({
      where: { transactionId },
      attributes: ["createdBy"],
      include: {
        model: Client,
        as: "Client",
        attributes: ["clientName"],
      },
    });

    const wasteName = quotationWaste ? quotationWaste.wasteName : "";
    const typeOfVehicle =
      quotationTransportation?.VehicleType?.typeOfVehicle || "CLIENT VEHICLE";
    const clientName = bookedTransaction?.Client?.clientName || "";
    const clientId = bookedTransaction?.createdBy || "";
    const clientType = clientId?.slice(0, 3) || "";

    const emailBody = await BookedTransactionEmailFormat(
      clientType,
      clientName,
      transactionId,
      haulingDate,
      haulingTime,
      wasteName,
      typeOfVehicle,
      remarks
    );

    try {
      sendEmail(
        // "jmfalar@fareastfuelcorp.com", // Recipient
        "marketing@fareastfuelcorp.com", // Recipient
        `${transactionId} - Booked Transaction: ${clientName}`, // Subject
        "Please view this email in HTML format.", // Plain-text fallback
        emailBody, // HTML content
        [
          "rmangaron@fareastfuelcorp.com",
          "edevera@fareastfuelcorp.com",
          "eb.devera410@gmail.com",
          "cc.duran@fareastfuel.com",
          "dcardinez@fareastfuelcorp.com",
          "dm.cardinez@fareastfuel.com",
        ] // cc
      ).catch((emailError) => {
        console.error("Error sending email:", emailError);
      });
    } catch (error) {
      console.error("Unexpected error when sending email:", error);
    }

    res.status(201).json({
      pendingTransactions: newTransaction.pending,
      inProgressTransactions: newTransaction.inProgress,
      finishedTransactions: newTransaction.finished,
    });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Booked Transactions controller
async function getBookedTransactionsController(req, res) {
  try {
    const { user } = req.query;
    console.log(user);
    // fetch transactions
    const data = await fetchData(statusId, user);

    res.status(200).json({
      pendingTransactions: data.pending,
      inProgressTransactions: data.inProgress,
      finishedTransactions: data.finished,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Booked Transactions controller
async function getBookedTransactionFullController(req, res) {
  try {
    const id = req.params.id;

    // fetch transactions
    const transaction = await fetchDataFull(id);

    res.status(200).json({
      transaction,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Booked Transactions By BilledTransaction Id controller
async function getBookedTransactionFullByBilledTransactionIdController(
  req,
  res
) {
  try {
    const id = req.params.id;

    const bookedTransactionId = await BilledTransaction.findByPk(id, {
      attributes: ["bookedTransactionId"],
    });

    // fetch transactions
    const transaction = await fetchDataFull(
      bookedTransactionId.bookedTransactionId
    );

    res.status(200).json({
      transaction,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Update Booked Transaction controller
async function updateBookedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating booked transaction with ID:", id);

    let {
      transporterClientId,
      quotationWasteId,
      quotationTransportationId,
      haulingDate,
      haulingTime,
      pttNo,
      manifestNo,
      pullOutFormNo,
      remarks,
      statusId,
      createdBy,
    } = req.body;

    remarks = remarks && remarks.toUpperCase();

    // Find the booked transaction by UUID (id) and update it
    const updatedBookedTransaction = await BookedTransaction.findByPk(id);

    if (updatedBookedTransaction) {
      // Update booked transaction attributes
      updatedBookedTransaction.quotationWasteId = quotationWasteId;
      updatedBookedTransaction.quotationTransportationId =
        quotationTransportationId;
      updatedBookedTransaction.haulingDate = haulingDate;
      updatedBookedTransaction.haulingTime = haulingTime;
      updatedBookedTransaction.pttNo = pttNo;
      updatedBookedTransaction.manifestNo = manifestNo;
      updatedBookedTransaction.pullOutFormNo = pullOutFormNo;
      updatedBookedTransaction.remarks = remarks;
      updatedBookedTransaction.statusId = statusId;
      updatedBookedTransaction.updatedBy = createdBy;

      if (transporterClientId) {
        const concatenatedString = transporterClientId.join(". ");

        updatedBookedTransaction.transporterClientId = concatenatedString;
      }

      // Save the updated booked transaction
      await updatedBookedTransaction.save();

      // fetch transactions
      const transactionId = updatedBookedTransaction.transactionId;

      const newTransaction = await fetchData(1, null, null, transactionId);

      console.log(newTransaction.pending);
      console.log(newTransaction.inProgress);

      // Respond with the updated data
      res.status(201).json({
        pendingTransactions: newTransaction.pending,
        inProgressTransactions: newTransaction.inProgress,
        finishedTransactions: newTransaction.finished,
      });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating booked transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Booked Transaction controller
async function deleteBookedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting booked transaction with ID:", id);

    // Find the booked transaction by UUID (id)
    const bookedTransactionToDelete = await BookedTransaction.findByPk(id);

    if (bookedTransactionToDelete) {
      // Update the deletedBy field
      bookedTransactionToDelete.updatedBy = deletedBy;
      bookedTransactionToDelete.deletedBy = deletedBy;
      await bookedTransactionToDelete.save();

      // Soft delete the booked transaction (sets deletedAt timestamp)
      await bookedTransactionToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Booked Transaction with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If booked transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Booked Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting booked transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Booked Transactions Dashboard controller
async function geBookedTransactionsDashboardController(req, res) {
  try {
    const { startDate, endDate, clientId } = req.params;

    console.log(clientId);

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const pendingCount = await BookedTransaction.count({
      where: {
        statusId: 1,
        createdBy: clientId,
        haulingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const inProgressCount = await BookedTransaction.count({
      where: {
        statusId: { [Op.between]: [2, 8] },
        createdBy: clientId,
        haulingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const certifiedCount = await BookedTransaction.count({
      where: {
        statusId: {
          [Op.gte]: 9, // Change to greater than or equal to 9
        },
        createdBy: clientId,
        haulingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const billedCount = await BookedTransaction.count({
      where: {
        statusId: {
          [Op.gte]: 10, // Change to greater than or equal to 9
        },
        createdBy: clientId,
        haulingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const allCount = await BookedTransaction.count({
      where: {
        createdBy: clientId,
        haulingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const uniqueBillingNumbers = await BilledTransaction.findAll({
      attributes: [
        "id",
        "billingNumber",
        "billedAmount",
        "billedDate",
        "billedTime",
      ],
      include: [
        {
          model: BookedTransaction,
          as: "BookedTransaction",
          where: {
            createdBy: clientId,
          },
        },
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
                },
              ],
            },
          ],
        },
      ],
      group: ["billingNumber"], // Group by billingNumber to get unique values
    });

    const bookedTransactions = await BookedTransaction.findAll({
      where: {
        createdBy: clientId,
        haulingDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Respond with the updated data
    res.status(200).json({
      pendingCount,
      inProgressCount,
      certifiedCount,
      billedCount,
      allCount,
      billedTransactions: uniqueBillingNumbers,
      billedTransactionsDetail: bookedTransactions,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Booked Transactions Dashboard Full controller
async function geBookedTransactionsDashboardFullController(req, res) {
  try {
    const { startDate, endDate, clientId } = req.params;

    console.log(clientId);

    // Log the dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const billedTransactions = await BilledTransaction.findAll({
      attributes: [
        "id",
        "billingNumber",
        "billedAmount",
        "billedDate",
        "billedTime",
      ],
      include: [
        {
          model: BookedTransaction,
          as: "BookedTransaction",
          where: {
            createdBy: clientId,
          },
          include: [
            {
              model: QuotationWaste,
              as: "QuotationWaste",
              required: false,
              include: {
                model: Quotation,
                as: "Quotation",
                required: false,
              },
            },
            {
              model: QuotationTransportation,
              as: "QuotationTransportation",
              required: false,
            },
            {
              model: ScheduledTransaction,
              as: "ScheduledTransaction",
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
                            },
                          ],
                        },
                        {
                          model: CertifiedTransaction,
                          as: "CertifiedTransaction",
                          required: false,
                        },
                      ],
                    },
                  ],
                },
                {
                  model: DispatchedTransaction,
                  as: "DispatchedTransaction",
                  required: false,
                },
              ],
            },
          ],
        },
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
                },
              ],
            },
          ],
        },
      ],
    });

    const totals = {}; // To store total amounts for each billingNumber

    const processedIds = new Set();

    let totalWeight = 0;

    billedTransactions.sort((a, b) => {
      const dateA = new Date(
        a.BookedTransaction.ScheduledTransaction[0].scheduledDate
      );
      const dateB = new Date(
        b.BookedTransaction.ScheduledTransaction[0].scheduledDate
      );

      // Sort in ascending order; for descending, switch dateA and dateB
      return dateA - dateB;
    });

    billedTransactions.forEach((transaction) => {
      const bookedTransactionId = transaction.BookedTransaction.id;
      console.log(bookedTransactionId);
      // Skip processing if this id has already been processed
      if (processedIds.has(bookedTransactionId)) {
        console.log(bookedTransactionId);
        return; // Continue to the next iteration
      }

      // Mark this id as processed
      processedIds.add(bookedTransactionId);

      const billingNumber = transaction.billingNumber; // Get the billing number

      // Ensure the totals object for this billingNumber is initialized
      if (!totals[billingNumber]) {
        totals[billingNumber] = {
          amounts: { vatExclusive: 0, vatInclusive: 0, nonVatable: 0 },
          credits: { vatExclusive: 0, vatInclusive: 0, nonVatable: 0 },
          terms: 0,
          termsRemarks: "",
          haulingDate: "",
          distributedDate: "",
          isCollected: false,
        };
      }

      const certifiedTransaction =
        transaction.BookedTransaction.ScheduledTransaction[0]
          .ReceivedTransaction[0].SortedTransaction[0].CertifiedTransaction[0];

      const typeOfWeight =
        certifiedTransaction?.typeOfWeight || "SORTED WEIGHT";

      const hasFixedRate =
        transaction.BookedTransaction.QuotationWaste?.hasFixedRate;

      const scheduledDate =
        transaction.BookedTransaction.ScheduledTransaction?.[0]?.scheduledDate;

      totals[billingNumber].haulingDate = scheduledDate;

      const distributedDate =
        transaction.BillingApprovalTransaction?.BillingDistributionTransaction
          ?.distributedDate;

      totals[billingNumber].distributedDate = distributedDate;

      const termsChargeDays =
        transaction.BookedTransaction.QuotationWaste?.Quotation
          ?.termsChargeDays;
      const termsCharge =
        transaction.BookedTransaction.QuotationWaste?.Quotation?.termsCharge;
      const termsBuyingDays =
        transaction.BookedTransaction.QuotationWaste?.Quotation
          ?.termsBuyingDays;
      const termsBuying =
        transaction.BookedTransaction.QuotationWaste?.Quotation?.termsBuying;
      const isCollected =
        transaction.BillingApprovalTransaction?.BillingDistributionTransaction
          ?.CollectedTransaction;

      totals[billingNumber].terms =
        termsCharge !== "N/A" ? termsChargeDays : termsBuyingDays;

      totals[billingNumber].termsRemarks =
        termsCharge !== "N/A" ? termsCharge : termsBuying;

      totals[billingNumber].isCollected = isCollected ? true : false;

      const sortedWasteTransaction =
        transaction.BookedTransaction.ScheduledTransaction[0]
          .ReceivedTransaction[0].SortedTransaction[0].SortedWasteTransaction;

      // Create a new array by aggregating the `weight` for duplicate `QuotationWaste.id`
      const aggregatedWasteTransactions = Object.values(
        sortedWasteTransaction.reduce((acc, current) => {
          const { id } = current.QuotationWaste;

          const currentWeight = new Decimal(current.weight); // Use Decimal.js
          const currentClientWeight = new Decimal(current.clientWeight); // Use Decimal.js

          // If the `QuotationWaste.id` is already in the accumulator, add the weight
          if (acc[id]) {
            acc[id].weight = acc[id].weight.plus(currentWeight);
            acc[id].clientWeight =
              acc[id].clientWeight.plus(currentClientWeight);
          } else {
            // Otherwise, set the initial object in the accumulator
            acc[id] = {
              ...current,
              weight: currentWeight,
              clientWeight: currentClientWeight,
            };
          }

          return acc;
        }, {})
      ).map((item) => ({
        ...item,
        weight: item.weight.toNumber(), // Convert Decimal back to a standard number
      }));

      let hasTransportation;

      // SMB
      if (hasFixedRate && isMonthly) {
        let vatCalculation;
        let fixedWeight;
        let fixedPrice;
        let unitPrice;

        let target;

        aggregatedWasteTransactions.forEach((item) => {
          const { weight, clientWeight, QuotationWaste } = item;

          const selectedWeight =
            typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

          totalWeight += selectedWeight; // Total weight multiplied by unit price

          target =
            QuotationWaste.mode === "BUYING"
              ? totals[billingNumber].credits
              : totals[billingNumber].amounts; // Determine if it should go to credits or amounts

          vatCalculation = QuotationWaste.vatCalculation;
          fixedWeight = QuotationWaste.fixedWeight;
          fixedPrice = QuotationWaste.fixedPrice;
          unitPrice = QuotationWaste.unitPrice;
          hasTransportation = QuotationWaste.hasTransportation;
        });

        switch (vatCalculation) {
          case "VAT EXCLUSIVE":
            target.vatExclusive = fixedPrice;
            break;
          case "VAT INCLUSIVE":
            target.vatInclusive = fixedPrice;
            break;
          case "NON VATABLE":
            target.nonVatable = fixedPrice;
            break;
          default:
            break;
        }

        if (totalWeight > fixedWeight) {
          const excessWeight = totalWeight - fixedWeight;

          const excessPrice = excessWeight * unitPrice;

          switch (vatCalculation) {
            case "VAT EXCLUSIVE":
              target.vatExclusive += excessPrice;
              break;
            case "VAT INCLUSIVE":
              target.vatInclusive += excessPrice;
              break;
            case "NON VATABLE":
              target.nonVatable += excessPrice;
              break;
            default:
              break;
          }
        }
      }
      // LOREAL, RED CROSS
      else if (hasFixedRate && !isMonthly) {
        let hasFixedRateIndividual;
        let vatCalculation;
        let fixedWeight;
        let fixedPrice;
        let unitPrice;

        let target;

        let usedWeight;

        aggregatedWasteTransactions.forEach((item) => {
          const { weight, clientWeight, QuotationWaste } = item;

          const selectedWeight =
            typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

          usedWeight = selectedWeight;

          const totalWeightPrice = selectedWeight * QuotationWaste.unitPrice; // Total weight multiplied by unit price

          target =
            QuotationWaste.mode === "BUYING"
              ? totals[billingNumber].credits
              : totals[billingNumber].amounts; // Determine if it should go to credits or amounts

          hasFixedRateIndividual = QuotationWaste.hasFixedRate;
          vatCalculation = QuotationWaste.vatCalculation;
          fixedWeight = QuotationWaste.fixedWeight;
          fixedPrice = QuotationWaste.fixedPrice;
          unitPrice = QuotationWaste.unitPrice;
          hasTransportation = QuotationWaste.hasTransportation;

          if (!hasFixedRateIndividual) {
            switch (QuotationWaste.vatCalculation) {
              case "VAT EXCLUSIVE":
                target.vatExclusive += totalWeightPrice;
                break;
              case "VAT INCLUSIVE":
                target.vatInclusive += totalWeightPrice;
                break;
              case "NON VATABLE":
                target.nonVatable += totalWeightPrice;
                break;
              default:
                break;
            }
          }
        });

        switch (vatCalculation) {
          case "VAT EXCLUSIVE":
            target.vatExclusive += fixedPrice;
            break;
          case "VAT INCLUSIVE":
            target.vatInclusive += fixedPrice;
            break;
          case "NON VATABLE":
            target.nonVatable += fixedPrice;
            break;
          default:
            break;
        }

        if (usedWeight > fixedWeight) {
          const excessWeight = new Decimal(usedWeight)
            .minus(new Decimal(fixedWeight))
            .toNumber();

          const excessPrice = excessWeight * unitPrice;

          switch (vatCalculation) {
            case "VAT EXCLUSIVE":
              target.vatExclusive += excessPrice;
              break;
            case "VAT INCLUSIVE":
              target.vatInclusive += excessPrice;
              break;
            case "NON VATABLE":
              target.nonVatable += excessPrice;
              break;
            default:
              break;
          }
        }
      } else {
        // Calculate amounts and credits based on vatCalculation and mode
        aggregatedWasteTransactions.forEach((item) => {
          const { weight, clientWeight, QuotationWaste } = item;

          const selectedWeight =
            typeOfWeight === "CLIENT WEIGHT" ? clientWeight : weight;

          const totalWeightPrice = selectedWeight * QuotationWaste.unitPrice; // Total weight multiplied by unit price
          console.log(totalWeightPrice);
          console.log(QuotationWaste.wasteName);
          const target =
            QuotationWaste.mode === "BUYING"
              ? totals[billingNumber].credits
              : totals[billingNumber].amounts; // Determine if it should go to credits or amounts

          hasTransportation = QuotationWaste.hasTransportation;

          console.log(totals[billingNumber].credits);
          console.log(totals[billingNumber].amounts);

          switch (QuotationWaste.vatCalculation) {
            case "VAT EXCLUSIVE":
              target.vatExclusive += totalWeightPrice;
              break;
            case "VAT INCLUSIVE":
              target.vatInclusive += totalWeightPrice;
              break;
            case "NON VATABLE":
              target.nonVatable += totalWeightPrice;
              break;
            default:
              break;
          }
        });
      }

      const transpoFee =
        transaction.BookedTransaction.QuotationTransportation?.unitPrice || 0;
      console.log("transpoFee;", transpoFee);
      const transpoVatCalculation =
        transaction.BookedTransaction.QuotationTransportation?.vatCalculation;
      const transpoMode =
        transaction.BookedTransaction.QuotationTransportation?.mode;
      let isTransportation =
        transaction.BookedTransaction.ScheduledTransaction?.[0]
          ?.DispatchedTransaction.length === 0
          ? false
          : true;

      const logisticsId =
        transaction.BookedTransaction.ScheduledTransaction?.[0]?.logisticsId;

      const clientVehicle = "dbbeee0a-a2ea-44c5-b17a-b21ac4bb2788";

      if (!isTransportation) {
        isTransportation = logisticsId !== clientVehicle ? true : false;
      }

      const addTranspoFee = (
        transpoFee,
        transpoVatCalculation,
        transpoMode
      ) => {
        console.log(transpoFee);
        // Check if the mode is "CHARGE"
        if (transpoMode === "CHARGE") {
          // Add the transportation fee based on VAT calculation
          switch (transpoVatCalculation) {
            case "VAT EXCLUSIVE":
              totals[billingNumber].amounts.vatExclusive += transpoFee;
              break;
            case "VAT INCLUSIVE":
              totals[billingNumber].amounts.vatInclusive += transpoFee;
              break;
            case "NON VATABLE":
              totals[billingNumber].amounts.nonVatable += transpoFee;
              break;
            default:
              break;
          }
        }
        console.log(totals[billingNumber].credits);
        console.log(totals[billingNumber].amounts);
      };

      // Call the function to add transportation fee
      if (isTransportation && hasTransportation) {
        addTranspoFee(transpoFee, transpoVatCalculation, transpoMode);
      }
    });

    console.log(totals);

    // Add a `total` attribute to each billing number object
    Object.keys(totals).forEach((billingNumber) => {
      const { amounts, credits } = totals[billingNumber];

      // Calculate the total
      const total =
        (amounts.vatExclusive || 0) * 1.12 +
        (amounts.vatInclusive || 0) +
        (amounts.nonVatable || 0) -
        ((credits.vatExclusive || 0) * 1.12 +
          (credits.vatInclusive || 0) +
          (credits.nonVatable || 0));

      // Add the total attribute
      totals[billingNumber].total = total;
    });

    // Now, `totals` will contain the total amount for each `billingNumber`
    console.log(totals);

    // Respond with the updated data
    res.status(200).json({
      billedTransaction: billedTransactions,
      totals,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  createBookedTransactionController,
  getBookedTransactionsController,
  getBookedTransactionFullController,
  getBookedTransactionFullByBilledTransactionIdController,
  geBookedTransactionsDashboardController,
  geBookedTransactionsDashboardFullController,
  updateBookedTransactionController,
  deleteBookedTransactionController,
};
