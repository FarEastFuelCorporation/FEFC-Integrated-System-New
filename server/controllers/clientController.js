// controllers/clientController.js

const Client = require("../models/Client");

// Get client details by ID
async function getClientRecords(req, res) {
  try {
    const client = await Client.findByPk(req.params.id);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update client details
async function updateClientRecords(req, res) {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      await client.update(req.body);
      res.json(client);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getClientRecords,
  updateClientRecords,
};
