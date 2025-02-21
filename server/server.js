// server.js

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = require("./app");
const http = require("http");
const {
  initWebSocketServer,
  closeAllConnections,
} = require("./websocketManager");
const mqtt = require("mqtt");
const axios = require("axios");

const port = process.env.PORT || 3001;

// MQTT Configuration
const mqttBroker = process.env.MQTT_BROKER;
const mqttTopic = process.env.MQTT_TOPIC;
const apiUrl = process.env.API_URL;

// Import WebSocket Manager

// Create an HTTP server for both Express and WebSocket
const server = http.createServer(app);

// Initialize WebSocket server
initWebSocketServer(server);

// Connect to MQTT Broker
const client = mqtt.connect(mqttBroker);

client.on("connect", () => {
  console.log(`✅ Connected to MQTT Broker: ${mqttBroker}`);
  client.subscribe(mqttTopic, (err) => {
    if (!err) {
      console.log(`📡 Subscribed to topic: ${mqttTopic}`);
    } else {
      console.error("❌ Subscription error:", err);
    }
  });
});

// Listen for incoming MQTT messages
client.on("message", (topic, message) => {
  console.log(`📩 Received Message on ${topic}: ${message.toString()}`);

  try {
    const data = JSON.parse(message.toString());

    // Forward to HTTP API
    axios
      .post(apiUrl, data)
      .then((res) => {
        console.log(`✅ Sent to API: ${res.status}`);
      })
      .catch((err) => {
        console.error("❌ Error sending data:", err.message);
      });
  } catch (error) {
    console.error("❌ Invalid JSON format:", error.message);
  }
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing server");
  closeAllConnections(); // Close all WebSocket connections
  client.end(); // Close MQTT connection
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
