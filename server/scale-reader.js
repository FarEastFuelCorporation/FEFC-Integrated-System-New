const { SerialPort } = require("serialport"); // Correct import for SerialPort
const { ReadlineParser } = require("@serialport/parser-readline"); // Correct import for ReadlineParser
const { broadcastMessage } = require("./websocketManager");

// List of COM ports to try
const comPorts = ["COM7", "COM8", "COM9", "COM10", "COM11"];
let port;

// Function to check if the scale is connected by attempting to open a COM port
async function checkScaleConnection() {
  for (let comPort of comPorts) {
    try {
      port = new SerialPort({ path: comPort, baudRate: 9600 });

      // Wait for the port to open successfully
      await new Promise((resolve, reject) => {
        port.on("open", resolve);
        port.on("error", reject); // If an error occurs (e.g., no scale), reject it
      });

      console.log(`Successfully connected to scale on ${comPort}`);
      startReadingData(port); // If successful, start reading data
      return; // Exit after successful connection
    } catch (error) {
      console.error(`Failed to connect to ${comPort}: ${error.message}`);
    }
  }

  console.log("No scale connected. Scale reading will not start.");
}

// Function to read data from the scale and broadcast it
function startReadingData(port) {
  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

  let lastWeight = null;

  parser.on("data", (rawData) => {
    const match = rawData.match(/(\d+\.\d+|\d+)/);
    const weight = match ? parseFloat(match[0]) : null;

    if (weight !== null && weight !== lastWeight) {
      lastWeight = weight;
      broadcastMessage({
        type: "LIVE_WEIGHT",
        data: {
          value: weight,
          timestamp: new Date().toISOString(),
        },
      });

      console.log("📦 Sent weight:", weight);
    }
  });
}

// Start by checking if the scale is connected
checkScaleConnection();
