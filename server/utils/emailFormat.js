// utils/emailFormat

async function BookedTransactionEmailFormat(
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
                <p>The following client has successfully booked a hauling transaction. Please see the details below:</p>
                  <p><strong>Client Name:</strong> ${clientName}</p>
                  <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                  <tr style="background-color: #007bff; color: white; text-align: left;">
                      <th style="padding: 8px;">Transaction ID</th>
                      <th style="padding: 8px;">Hauling Date</th>
                      <th style="padding: 8px;">Hauling Time</th>
                  </tr>
                  <tr>
                      <td style="padding: 8px; text-align: center;">${transactionId}</td>
                      <td style="padding: 8px; text-align: center;">${haulingDate}</td>
                      <td style="padding: 8px; text-align: center;">${haulingTime}</td>
                  </tr>
                  <tr style="background-color: #007bff; color: white; text-align: left;">
                      <th style="padding: 8px;">Waste Name</th>
                      <th style="padding: 8px;">Type of Vehicle</th>
                      <th style="padding: 8px;">Remarks</th>
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
                <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
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

module.exports = BookedTransactionEmailFormat;
