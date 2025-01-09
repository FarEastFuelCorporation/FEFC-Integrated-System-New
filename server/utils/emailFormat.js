// utils/emailFormat

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function convertTo12HourFormat(time) {
  const [hour, minute] = time.split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const convertedHour = hour % 12 || 12; // Convert 0 to 12 for midnight
  return `${convertedHour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;
}

async function BookedTransactionEmailFormat(
  clientType,
  clientName,
  transactionId,
  haulingDate,
  haulingTime,
  wasteName,
  typeOfVehicle,
  remarks
) {
  try {
    const emailTemplate = `
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                background-color: #f9f9f9;
              }
              .header {
                text-align: center;
                background-color: #007bff;
                color: white;
                padding: 10px 0;
                border-radius: 8px 8px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                margin: 20px 0;
              }
              .content p {
                margin: 10px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Client Booking Notification</h1>
              </div>
              <div class="content">
                <p>Dear Marketing Department,</p>
                <p>The following client has successfully booked a ${
                  clientType === "CUS" ? "delivery" : "hauling"
                } transaction. Please see the details below:</p>
                  <p><strong>Client Name:</strong> ${clientName}</p>
                  <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                  <tr style="background-color: #007bff; color: white; text-align: left;">
                      <th style="padding: 8px; text-align: center;">Transaction ID</th>
                      <th style="padding: 8px; text-align: center;">${
                        clientType === "CUS" ? "Delivery Date" : "Hauling Date"
                      }</th>
                      <th style="padding: 8px; text-align: center;">${
                        clientType === "CUS" ? "Delivery Time" : "Hauling Time"
                      }</th>
                  </tr>
                  <tr>
                      <td style="padding: 8px; text-align: center;">${transactionId}</td>
                      <td style="padding: 8px; text-align: center;">${formatDate(
                        haulingDate
                      )}</td>
                      <td style="padding: 8px; text-align: center;">${convertTo12HourFormat(
                        haulingTime
                      )}</td>
                  </tr>
                  <tr style="background-color: #007bff; color: white; text-align: left;">
                      <th style="padding: 8px; text-align: center;">${
                        clientType === "CUS" ? "Product" : "Waste Name"
                      }</th>
                      <th style="padding: 8px; text-align: center;">Type of Vehicle</th>
                      <th style="padding: 8px; text-align: center;">Remarks</th>
                  </tr>
                  <tr>
                      <td style="padding: 8px; text-align: center;">${wasteName}</td>
                      <td style="padding: 8px; text-align: center;">${typeOfVehicle}</td>
                      <td style="padding: 8px; text-align: center;">${remarks}</td>
                  </tr>
                  </table>
                <p>Please ensure the necessary arrangements are made to facilitate this transaction smoothly.</p>
                <p>Thank you for your attention to this matter.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

    return emailTemplate;
  } catch (error) {
    console.error("Error generating email template:", error);
    throw error;
  }
}

async function ScheduleTransactionEmailFormat(
  clientType,
  clientName,
  transactionId,
  scheduledDate,
  scheduledTime,
  wasteName,
  typeOfVehicle,
  remarks,
  scheduledBy
) {
  try {
    const emailTemplate = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            background-color: #007bff;
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Scheduled Transaction Confirmation</h1>
          </div>
          <div class="content">
            <p>Dear ${clientName},</p>
            <p>We are confirming the booking of your ${
              clientType === "CUS" ? "delivery" : "hauling"
            } transaction. Please find the details below:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="background-color: #007bff; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">Transaction ID</th>
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS"
                    ? "Scheduled Delivery Date"
                    : "Scheduled Hauling Date"
                }</th>
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS"
                    ? "Scheduled Delivery Time"
                    : "Scheduled Hauling Time"
                }</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${transactionId}</td>
                <td style="padding: 8px; text-align: center;">${formatDate(
                  scheduledDate
                )}</td>
                <td style="padding: 8px; text-align: center;">${convertTo12HourFormat(
                  scheduledTime
                )}</td>
              </tr>
              <tr style="background-color: #007bff; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS" ? "Product" : "Waste Name"
                }</th>
                <th style="padding: 8px; text-align: center;">Type of Vehicle</th>
                <th style="padding: 8px; text-align: center;">Remarks</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${wasteName}</td>
                <td style="padding: 8px; text-align: center;">${typeOfVehicle}</td>
                <td style="padding: 8px; text-align: center;">${remarks}</td>
              </tr>
            </table>
            <p><strong>Scheduled By:</strong> ${scheduledBy}</p>
            <p>We kindly ask you to ensure that all necessary arrangements are in place for this scheduled transaction.</p>
            <p>Thank you for your prompt attention to this matter.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailTemplate;
  } catch (error) {
    console.error(
      "Error generating schedule transaction email template:",
      error
    );
    throw error;
  }
}

async function ScheduleTransactionEmailToLogisticsFormat(
  clientType,
  clientName,
  transactionId,
  scheduledDate,
  scheduledTime,
  wasteName,
  typeOfVehicle,
  remarks,
  scheduledBy
) {
  try {
    const emailTemplate = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            background-color: #007bff;
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Scheduled Transaction Notification</h1>
          </div>
          <div class="content">
            <p>Dear Logistics Department,</p>
            <p>We would like to inform you of a newly scheduled ${
              clientType === "CUS" ? "delivery" : "hauling"
            } transaction for ${clientName}. Please find the details below:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="background-color: #007bff; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">Transaction ID</th>
                <th style="padding: 8px; text-align: center;">Scheduled Date</th>
                <th style="padding: 8px; text-align: center;">Scheduled Time</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${transactionId}</td>
                <td style="padding: 8px; text-align: center;">${formatDate(
                  scheduledDate
                )}</td>
                <td style="padding: 8px; text-align: center;">${convertTo12HourFormat(
                  scheduledTime
                )}</td>
              </tr>
              <tr style="background-color: #007bff; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">Waste Name</th>
                <th style="padding: 8px; text-align: center;">Type of Vehicle</th>
                <th style="padding: 8px; text-align: center;">Remarks</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${wasteName}</td>
                <td style="padding: 8px; text-align: center;">${typeOfVehicle}</td>
                <td style="padding: 8px; text-align: center;">${remarks}</td>
              </tr>
            </table>
            <p><strong>Scheduled By:</strong> ${scheduledBy}</p>
            <p>Please ensure that the necessary arrangements are made for this scheduled transaction.</p>
            <p>If you have any questions, please feel free to contact us.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailTemplate;
  } catch (error) {
    console.error(
      "Error generating schedule transaction email for logistics:",
      error
    );
    throw error;
  }
}

async function CertifiedTransactionEmailFormat(
  clientType,
  clientName,
  transactionId,
  scheduledDate,
  scheduledTime,
  wasteName,
  typeOfVehicle,
  remarks,
  submittedBy,
  wasteCategory
) {
  try {
    const emailTemplate = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            background-color: #6f42c1;
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Certified Transaction Notification</h1>
          </div>
          <div class="content">
            <p>Dear ${clientName},</p>
            <p>We are pleased to inform you that your ${
              clientType === "CUS" ? "delivery" : "hauling"
            } transaction has been ${
      wasteCategory === "HW" ? "treated" : "disposed"
    } completely and has been certified. You can now download the certificate directly from the system. Please find the transaction details below:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="background-color: #6f42c1; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">Transaction ID</th>
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS"
                    ? "Scheduled Delivery Date"
                    : "Scheduled Hauling Date"
                }</th>
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS"
                    ? "Scheduled Delivery Time"
                    : "Scheduled Hauling Time"
                }</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${transactionId}</td>
                <td style="padding: 8px; text-align: center;">${formatDate(
                  scheduledDate
                )}</td>
                <td style="padding: 8px; text-align: center;">${convertTo12HourFormat(
                  scheduledTime
                )}</td>
              </tr>
              <tr style="background-color: #6f42c1; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS" ? "Product" : "Waste Name"
                }</th>
                <th style="padding: 8px; text-align: center;">Type of Vehicle</th>
                <th style="padding: 8px; text-align: center;">Remarks</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${wasteName}</td>
                <td style="padding: 8px; text-align: center;">${typeOfVehicle}</td>
                <td style="padding: 8px; text-align: center;">${remarks}</td>
              </tr>
            </table>
            <p><strong>Submitted By:</strong> ${submittedBy}</p>
            <p>To access and download the certificate, please log in to your account on our system.</p>
            <p>If you have any questions or need further assistance, feel free to contact us.</p>
            <p>Thank you for trusting FAR EAST FUEL CORPORATION.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailTemplate;
  } catch (error) {
    console.error(
      "Error generating certified transaction email template:",
      error
    );
    throw error;
  }
}

async function CertifiedTransactionEmailToAccountingFormat(
  clientType,
  clientName,
  transactionId,
  scheduledDate,
  scheduledTime,
  wasteName,
  typeOfVehicle,
  remarks,
  submittedBy,
  wasteCategory
) {
  try {
    const emailTemplate = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            background-color: #6f42c1;
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Certified Transaction Notification</h1>
          </div>
          <div class="content">
            <p>Dear Accounting Department,</p>
            <p>We would like to inform you that the following transaction has been fully ${
              wasteCategory === "HW" ? "treated" : "disposed"
            } and certified. It is now ready to be billed. Please find the transaction details below:</p>
            <p><strong>Client Name:</strong> ${clientName}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <tr style="background-color: #6f42c1; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">Transaction ID</th>
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS"
                    ? "Scheduled Delivery Date"
                    : "Scheduled Hauling Date"
                }</th>
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS"
                    ? "Scheduled Delivery Time"
                    : "Scheduled Hauling Time"
                }</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${transactionId}</td>
                <td style="padding: 8px; text-align: center;">${formatDate(
                  scheduledDate
                )}</td>
                <td style="padding: 8px; text-align: center;">${convertTo12HourFormat(
                  scheduledTime
                )}</td>
              </tr>
              <tr style="background-color: #6f42c1; color: white; text-align: left;">
                <th style="padding: 8px; text-align: center;">${
                  clientType === "CUS" ? "Product" : "Waste Name"
                }</th>
                <th style="padding: 8px; text-align: center;">Type of Vehicle</th>
                <th style="padding: 8px; text-align: center;">Remarks</th>
              </tr>
              <tr>
                <td style="padding: 8px; text-align: center;">${wasteName}</td>
                <td style="padding: 8px; text-align: center;">${typeOfVehicle}</td>
                <td style="padding: 8px; text-align: center;">${remarks}</td>
              </tr>
            </table>
            <p><strong>Submitted By:</strong> ${submittedBy}</p>
            <p>Please proceed with the billing process at your earliest convenience.</p>
            <p>If you have any questions or need further assistance, feel free to contact us.</p>
            <p>Thank you for your prompt action.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailTemplate;
  } catch (error) {
    console.error(
      "Error generating certified transaction email template for billing:",
      error
    );
    throw error;
  }
}

async function BillingApprovalEmailFormat(clientName, transactions) {
  try {
    const transactionRows = Object.values(transactions)
      .map(
        (transaction) => `
        <tr>
          <td>${transaction.transactionId}</td>
          <td>${formatDate(transaction.haulingDate)}</td>
          <td>${transaction.billingNumber}</td>
        </tr>`
      )
      .join("");

    const emailTemplate = `
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                background-color: #f9f9f9;
              }
              .header {
                text-align: center;
                background-color: #28a745;
                color: white;
                padding: 10px 0;
                border-radius: 8px 8px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                margin: 20px 0;
              }
              .content p {
                margin: 10px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
              }
              th {
                background-color: #28a745;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Billing Approval Notification</h1>
              </div>
              <div class="content">
                <p>Dear Accounting Head,</p>
                <p>The billing statement for the following client is pending approval. Please check the billing statement on the system:</p>
                <p><strong>Client Name:</strong> ${clientName}</p>
                <table>
                  <tr>
                      <th>Transaction ID</th>
                      <th>Hauling Date</th>
                      <th>Billing Number</th>
                  </tr>
                  ${transactionRows}
                </table>
                <p>Thank you for your prompt attention to this matter.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

    return emailTemplate;
  } catch (error) {
    console.error("Error generating billing approval email template:", error);
    throw error;
  }
}

async function BillingApprovedEmailFormat(clientName, transactions) {
  try {
    const transactionRows = Object.values(transactions)
      .map(
        (transaction) => `
        <tr>
          <td>${transaction.transactionId}</td>
          <td>${formatDate(transaction.haulingDate)}</td>
          <td>${transaction.billingNumber}</td>
        </tr>`
      )
      .join("");

    const emailTemplate = `
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 8px;
                background-color: #f9f9f9;
              }
              .header {
                text-align: center;
                background-color: #28a745;
                color: white;
                padding: 10px 0;
                border-radius: 8px 8px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                margin: 20px 0;
              }
              .content p {
                margin: 10px 0;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #777;
                margin-top: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
              }
              th {
                background-color: #28a745;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Billing Statement Notification</h1>
              </div>
              <div class="content">
                <p>Dear ${clientName},</p>
                <p>We are pleased to inform you that your billing statement has been completed and is now available for download on our system.</p>
                <table>
                  <tr>
                      <th>Transaction ID</th>
                      <th>Hauling Date</th>
                      <th>Billing Number</th>
                  </tr>
                  ${transactionRows}
                </table>
                <p>To access and download the billing statement, please log in to your account on our system.</p>
                <p>If you have any questions or need further assistance, feel free to contact us.</p>
                <p>Thank you for trusting FAR EAST FUEL CORPORATION.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `;

    return emailTemplate;
  } catch (error) {
    console.error("Error generating billing completion email template:", error);
    throw error;
  }
}

async function CollectedTransactionEmailFormat(
  clientName,
  transactions,
  totalAmountCollected,
  collectionDate
) {
  try {
    const transactionRows = Object.values(transactions)
      .map(
        (transaction) => ` 
        <tr>
          <td>${transaction.transactionId}</td>
          <td>${formatDate(transaction.haulingDate)}</td>
        </tr>`
      )
      .join("");

    const emailTemplate = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            background-color: #006400; /* Dark Green */
            color: white;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            margin: 20px 0;
          }
          .content p {
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #006400; /* Dark Green */
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Collected Transaction Notification</h1>
          </div>
          <div class="content">
            <p>Dear ${clientName},</p>
            <p>We are pleased to inform you that the following transactions have been successfully collected.</p>
            <p><strong>Total Amount Collected: ₱${totalAmountCollected}</strong></p>
            <p><strong>Collection Date: ${formatDate(
              collectionDate
            )}</strong></p>
            <table>
              <tr>
                <th>Transaction ID</th>
                <th>Hauling Date</th>
              </tr>
              ${transactionRows}
            </table>
            <p>Thank you for your prompt payments. If you have any questions or require further assistance, please do not hesitate to contact us.</p>
            <p>We appreciate your continued trust in FAR EAST FUEL CORPORATION.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return emailTemplate;
  } catch (error) {
    console.error(
      "Error generating collected transaction email template:",
      error
    );
    throw error;
  }
}

async function sendOtpFormat(otp) {
  try {
    const emailTemplate = `
            <html>
                <head>
                    <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        border: 1px solid #ddd;
                        padding: 20px;
                        border-radius: 8px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        text-align: center;
                        background-color: #007bff;
                        color: white;
                        padding: 10px 0;
                        border-radius: 8px 8px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        margin: 20px 0;
                    }
                    .content p {
                        margin: 10px 0;
                    }
                    .otp {
                        font-size: 30px;
                        font-weight: bold;
                        color: #007bff;
                        text-align: center;
                        margin-top: 20px;
                        padding: 10px;
                        border: 2px solid #007bff;
                        display: inline-block;
                        border-radius: 4px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777;
                        margin-top: 20px;
                    }
                    </style>
                </head>
                <body>
                    <div class="container">
                    <div class="header">
                        <h1>OTP Verification</h1>
                    </div>
                    <div class="content">
                        <p>Dear Valued User,</p>
                        <p>We have received a request to verify your identity. Please use the following OTP to complete the process:</p>
                        <div class="otp">
                        ${otp}
                        </div>
                        <p>If you did not request this OTP, please ignore this email.</p>
                        <p>Thank you for using our service!</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} FAR EAST FUEL CORPORATION. All rights reserved.</p>
                    </div>
                    </div>
                </body>
                </html>

          `;

    return emailTemplate;
  } catch (error) {
    console.error("Error generating email template:", error);
    throw error;
  }
}

module.exports = {
  BookedTransactionEmailFormat,
  ScheduleTransactionEmailFormat,
  ScheduleTransactionEmailToLogisticsFormat,
  CertifiedTransactionEmailFormat,
  CertifiedTransactionEmailToAccountingFormat,
  BillingApprovalEmailFormat,
  BillingApprovedEmailFormat,
  sendOtpFormat,
};
