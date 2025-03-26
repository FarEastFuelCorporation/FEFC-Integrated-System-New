const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");

// Use Maps for better performance
const connections = new Map(); // Store WebSocket connections
const users = new Map(); // Store user data

// Initialize WebSocket server
function initWebSocketServer(server) {
  const wsServer = new WebSocketServer({ noServer: true });

  // Handle WebSocket upgrades
  server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (ws) => {
      wsServer.emit("connection", ws, req);
    });
  });

  // Handle WebSocket connections
  wsServer.on("connection", (ws, req) => handleConnection(ws, req));

  return wsServer;
}

// Handle new WebSocket connection
function handleConnection(connection, request) {
  try {
    const parsedUrl = new URL(request.url, `http://${request.headers.host}`);
    const employeeId = parsedUrl.searchParams.get("employeeId") || "Anonymous";
    const employeeName =
      parsedUrl.searchParams.get("employeeName") || "Anonymous";

    const uuid = uuidv4();
    console.log(`New connection: EmployeeName=${employeeName}, UUID=${uuid}`);

    // Store connection and user data
    connections.set(uuid, connection);
    users.set(uuid, { employeeId, employeeName, state: {} });

    // Send a welcome message
    connection.send(
      JSON.stringify({
        type: "WELCOME",
        message: `Welcome, ${employeeName}!`,
        uuid,
      })
    );

    // Set up event handlers
    connection.on("message", (message) => handleMessage(message, uuid));
    connection.on("close", () => handleClose(uuid));
    connection.on("error", (error) => handleError(uuid, error));

    // Keep connection alive with ping/pong
    keepConnectionAlive(connection);
  } catch (error) {
    console.error("Error handling WebSocket connection:", error);
    connection.close();
  }
}

// Handle incoming messages
function handleMessage(message, uuid) {
  try {
    const parsedMessage = JSON.parse(message);
    if (!parsedMessage.type) {
      throw new Error("Invalid message format: 'type' field is required");
    }

    console.log(`Received message from ${uuid}:`, parsedMessage);

    switch (parsedMessage.type) {
      case "MESSAGE":
        // Broadcast the message to all clients
        broadcastMessage({
          type: "MESSAGE",
          from: users.get(uuid)?.employeeId,
          data: parsedMessage.data,
        });
        break;

      case "PING":
        // Handle ping from client
        connections.get(uuid)?.send(JSON.stringify({ type: "PONG" }));
        break;

      default:
        console.warn(`Unknown message type: ${parsedMessage.type}`);
    }
  } catch (error) {
    console.error(`Error processing message from ${uuid}:`, error.message);
  }
}

// Broadcast message to all connected clients
function broadcastMessage(message) {
  console.log(`Broadcasting message... ${message.type}`);
  for (const [uuid, connection] of connections.entries()) {
    if (connection.readyState === connection.OPEN) {
      try {
        connection.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to UUID=${uuid}:`, error);
      }
    }
  }
}

// Handle WebSocket connection closure
function handleClose(uuid) {
  console.log(`Connection closed: UUID=${uuid}`);
  connections.delete(uuid);
  users.delete(uuid);
}

// Handle WebSocket errors
function handleError(uuid, error) {
  console.error(`WebSocket error on UUID=${uuid}:`, error.message);
  connections.get(uuid)?.close();
  connections.delete(uuid);
  users.delete(uuid);
}

// Keep WebSocket connection alive
function keepConnectionAlive(connection) {
  const interval = setInterval(() => {
    if (connection.readyState === connection.OPEN) {
      connection.ping();
    } else {
      clearInterval(interval);
    }
  }, 30000); // Ping every 30 seconds
}

// Gracefully shut down all WebSocket connections
function closeAllConnections() {
  for (const [uuid, connection] of connections.entries()) {
    connection.close();
    connections.delete(uuid);
    users.delete(uuid);
  }
}

module.exports = {
  initWebSocketServer,
  broadcastMessage,
  closeAllConnections,
};
