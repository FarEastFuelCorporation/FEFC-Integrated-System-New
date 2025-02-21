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

const port = process.env.PORT || 3001;

// Import WebSocket Manager

// Create an HTTP server for both Express and WebSocket
const server = http.createServer(app);

// Initialize WebSocket server
initWebSocketServer(server);

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing server");
  closeAllConnections(); // Close all WebSocket connections
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
