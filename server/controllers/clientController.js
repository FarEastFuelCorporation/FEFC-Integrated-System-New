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

module.exports = {
  getClientRecords,
};
