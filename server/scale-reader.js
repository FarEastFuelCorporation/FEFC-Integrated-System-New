const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const { broadcastMessage } = require("./websocketManager");

const port = new SerialPort("COM7", { baudRate: 9600 }); // ✅ COM7 confirmed
const parser = port.pipe(new Readline({ delimiter: "\r\n" }));

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
