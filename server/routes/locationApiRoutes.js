// routes/locationApiRoutes.js

const express = require("express");
const router = express.Router();
const axios = require("axios");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

router.get("/api/autocomplete", async (req, res) => {
  const { input, level } = req.query;
  console.log(req.query);
  console.log(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=${level}&components=country:PH&key=${API_KEY}`
  );
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=${level}&components=country:PH&key=${API_KEY}`
  );
  console.log(response.data);
  try {
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching autocomplete suggestions" });
  }
});

router.get("/api", async (req, res) => {
  try {
    console.log("pass");
    res.data("pass");
  } catch (error) {
    res.status(500).json({ error: "Error fetching autocomplete suggestions" });
  }
});

module.exports = router;
