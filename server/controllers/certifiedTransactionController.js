// controllers/certifiedTransactionController.js

const sequelize = require("../config/database");
const BookedTransaction = require("../models/BookedTransaction");
const CertifiedTransaction = require("../models/CertifiedTransaction");
const Client = require("../models/Client");
const Employee = require("../models/Employee");
const QuotationTransportation = require("../models/QuotationTransportation");
const QuotationWaste = require("../models/QuotationWaste");
const ScheduledTransaction = require("../models/ScheduledTransaction");
const VehicleType = require("../models/VehicleType");
const sendEmail = require("../sendEmail");
const {
  CertifiedTransactionEmailFormat,
  CertifiedTransactionEmailToAccountingFormat,
} = require("../utils/emailFormat");
const generateCertificateNumber = require("../utils/generateCertificateNumber");
const { fetchData } = require("../utils/getBookedTransactions");
const transactionStatusId = 8;

// Create Certified Transaction controller
async function createCertifiedTransactionController(req, res) {
  const transaction = await sequelize.transaction();
  try {
    // Extracting data from the request body
    let {
      bookedTransactionId,
      sortedTransactionId,
      isBilled,
      isBillingApproved,
      certifiedDate,
      certifiedTime,
      typeOfCertificate,
      typeOfWeight,
      remarks,
      statusId,
      createdBy,
    } = req.body;
    console.log(req.body);

    remarks = remarks && remarks.toUpperCase();

    const certificateNumber = await generateCertificateNumber(
      typeOfCertificate
    );

    // Create CertifiedTransaction entry
    const certifiedTransaction = await CertifiedTransaction.create(
      {
        bookedTransactionId,
        sortedTransactionId,
        certificateNumber,
        certifiedDate,
        certifiedTime,
        typeOfCertificate,
        typeOfWeight,
        remarks,
        createdBy,
      },
      { transaction: transaction }
    );
    // Adding treated wastes to TreatedWasteTransaction table

    const updatedBookedTransaction = await BookedTransaction.findByPk(
      bookedTransactionId,
      {
        attributes: [
          "id",
          "transactionId",
          "statusId",
          "quotationWasteId",
          "quotationTransportationId",
        ],
        include: {
          model: Client,
          as: "Client",
          attributes: ["clientName", "email"],
        },
        transaction,
      }
    );

    if (updatedBookedTransaction) {
      updatedBookedTransaction.statusId = isBilled
        ? isBillingApproved
          ? 11
          : 10
        : statusId;
      await updatedBookedTransaction.save({ transaction });

      // Commit the transaction
      await transaction.commit();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      const scheduledTransactionData = await ScheduledTransaction.findOne({
        where: { bookedTransactionId },
        attributes: ["scheduledDate", "scheduledTime"],
      });

      const quotationWaste = await QuotationWaste.findByPk(
        updatedBookedTransaction.quotationWasteId,
        {
          attributes: ["wasteName"],
        }
      );

      const quotationTransportation = await QuotationTransportation.findByPk(
        updatedBookedTransaction.quotationTransportationId,
        {
          attributes: ["vehicleTypeId"],
          include: {
            model: VehicleType,
            as: "VehicleType",
            attributes: ["typeOfVehicle"],
          },
        }
      );

      const certifiedTransactionData = await CertifiedTransaction.findByPk(
        certifiedTransaction.id,
        {
          attributes: ["createdBy"],
          include: {
            model: Employee,
            as: "Employee",
            attributes: ["firstName", "lastName"],
          },
        }
      );

      const transactionId = updatedBookedTransaction.transactionId;
      const scheduledDate = scheduledTransactionData.scheduledDate;
      const scheduledTime = scheduledTransactionData.scheduledTime;

      const wasteName = quotationWaste ? quotationWaste.wasteName : "";
      const typeOfVehicle =
        quotationTransportation?.VehicleType?.typeOfVehicle || "CLIENT VEHICLE";
      const clientName = updatedBookedTransaction?.Client?.clientName || "";
      const clientId = updatedBookedTransaction?.createdBy || "";
      const clientType = clientId?.slice(0, 3) || "";
      const clientEmail = updatedBookedTransaction?.Client?.email || "";
      const submittedBy = `${certifiedTransactionData?.Employee?.firstName} ${certifiedTransactionData?.Employee?.lastName}`;

      const emailBody = await CertifiedTransactionEmailFormat(
        clientType,
        clientName,
        transactionId,
        scheduledDate,
        scheduledTime,
        wasteName,
        typeOfVehicle,
        remarks,
        submittedBy
      );
      console.log(emailBody);

      try {
        sendEmail(
          // "jmfalar@fareastfuelcorp.com", // Recipient
          clientEmail, // Recipient
          `${transactionId} - Certified Transaction Notification`, // Subject
          "Please view this email in HTML format.", // Plain-text fallback
          emailBody,
          ["marketing@fareastfuelcorp.com", "treatment@fareastfuelcorp.com"], // HTML content // cc
          [
            "rmangaron@fareastfuelcorp.com",
            "edevera@fareastfuelcorp.com",
            "eb.devera410@gmail.com",
            "cc.duran@fareastfuel.com",
          ] // bcc
        ).catch((emailError) => {
          console.error("Error sending email:", emailError);
        });
      } catch (error) {
        console.error("Unexpected error when sending email:", error);
      }

      const emailBody2 = await CertifiedTransactionEmailToAccountingFormat(
        clientType,
        clientName,
        transactionId,
        scheduledDate,
        scheduledTime,
        wasteName,
        typeOfVehicle,
        remarks,
        submittedBy
      );

      try {
        sendEmail(
          // "jmfalar@fareastfuelcorp.com", // Recipient
          "accounting@fareastfuelcorp.com", // Recipient
          `${transactionId} - For Billing: ${clientName}`, // Subject
          "Please view this email in HTML format.", // Plain-text fallback
          emailBody2,
          ["dm.cardinez@fareastfuel.com"], // HTML content // cc
          [
            "rmangaron@fareastfuelcorp.com",
            "edevera@fareastfuelcorp.com",
            "eb.devera410@gmail.com",
            "cc.duran@fareastfuel.com",
          ] // bcc
        ).catch((emailError) => {
          console.error("Error sending email:", emailError);
        });
      } catch (error) {
        console.error("Unexpected error when sending email:", error);
      }

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If booked transaction with the specified ID was not found
      await transaction.rollback();
      res.status(404).json({
        message: `Booked Transaction with ID ${bookedTransactionId} not found`,
      });
    }
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    await transaction.rollback();
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get Certified Transactions controller
async function getCertifiedTransactionsController(req, res) {
  try {
    // fetch transactions
    const data = await fetchData(transactionStatusId);

    // Respond with the updated data
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

// Update Certified Transaction controller
async function updateCertifiedTransactionController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating certified transaction with ID:", id);

    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      // Extracting data from the request body
      const {
        bookedTransactionId,
        sortedTransactionId,
        certifiedDate,
        certifiedTime,
        typeOfCertificate,
        typeOfWeight,
        remarks,
        statusId,
        createdBy,
      } = req.body;

      // Uppercase the remarks if present
      const updatedRemarks = remarks && remarks.toUpperCase();

      const certificateNumber = await generateCertificateNumber(
        typeOfCertificate
      );

      // Find the certified transaction by UUID (id)
      const certifiedTransaction = await CertifiedTransaction.findByPk(id);

      if (certifiedTransaction) {
        // Update certified transaction attributes
        certifiedTransaction.bookedTransactionId = bookedTransactionId;
        certifiedTransaction.sortedTransactionId = sortedTransactionId;
        certifiedTransaction.certificateNumber = certificateNumber;
        certifiedTransaction.certifiedDate = certifiedDate;
        certifiedTransaction.certifiedTime = certifiedTime;
        certifiedTransaction.typeOfCertificate = typeOfCertificate;
        certifiedTransaction.typeOfWeight = typeOfWeight;
        certifiedTransaction.remarks = updatedRemarks;
        certifiedTransaction.updatedBy = createdBy;

        // Save the updated certified transaction
        await certifiedTransaction.save({ transaction });

        // Fetch updated data after the save operation (you may want to modify this)
        const data = await fetchData(statusId);

        // Commit the transaction
        await transaction.commit();

        // Respond with the updated data
        res.status(200).json({
          pendingTransactions: data.pending,
          inProgressTransactions: data.inProgress,
          finishedTransactions: data.finished,
        });
      } else {
        // If certified transaction with the specified ID was not found
        await transaction.rollback();
        res
          .status(404)
          .json({ message: `Certified Transaction with ID ${id} not found` });
      }
    } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      console.error("Error updating certified transaction:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete Certified Transaction controller
async function deleteCertifiedTransactionController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy, bookedTransactionId } = req.body;

    console.log(bookedTransactionId);

    console.log("Soft deleting certified transaction with ID:", id);

    // Find the certified transaction by UUID (id)
    const certifiedTransactionToDelete = await CertifiedTransaction.findByPk(
      id
    );

    if (certifiedTransactionToDelete) {
      // Update the deletedBy field
      certifiedTransactionToDelete.updatedBy = deletedBy;
      certifiedTransactionToDelete.deletedBy = deletedBy;
      await certifiedTransactionToDelete.save();

      const updatedBookedTransaction = await BookedTransaction.findByPk(
        bookedTransactionId
      );
      console.log(updatedBookedTransaction);

      updatedBookedTransaction.statusId = transactionStatusId;

      await updatedBookedTransaction.save();

      // Soft delete the certified transaction (sets deletedAt timestamp)
      await certifiedTransactionToDelete.destroy();

      // fetch transactions
      const data = await fetchData(transactionStatusId);

      // Respond with the updated data
      res.status(200).json({
        pendingTransactions: data.pending,
        inProgressTransactions: data.inProgress,
        finishedTransactions: data.finished,
      });
    } else {
      // If certified transaction with the specified ID was not found
      res
        .status(404)
        .json({ message: `Certified Transaction with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting certified transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createCertifiedTransactionController,
  getCertifiedTransactionsController,
  updateCertifiedTransactionController,
  deleteCertifiedTransactionController,
};
