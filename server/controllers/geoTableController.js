// controllers/geoTableController.js

const sequelize = require("../config/database");
const GeoTable = require("../models/GeoTable");

// Get Provinces controller
async function getProvincesController(req, res) {
  try {
    // Fetch unique provinces from the GeoTable
    const provinces = await GeoTable.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("province")), "province"],
      ],
      order: [["province", "ASC"]],
    });
    // Format the result to return only the unique province names
    const uniqueProvinces = provinces.map((item) => item.province);
    console.log(uniqueProvinces);

    res.json({ provinces: uniqueProvinces });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Provinces controller
async function getCitiesController(req, res) {
  try {
    const { province } = req.params;

    if (!province) {
      return res.status(400).send("Province parameter is required");
    }

    // Fetch cities based on the provided province
    const cities = await GeoTable.findAll({
      where: { province },
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("municipality")),
          "municipality",
        ],
      ],
      order: [["municipality", "ASC"]],
    });

    if (!cities.length) {
      return res.status(404).send("No cities found for the specified province");
    }

    // Format the result to return only the unique province names
    const options = cities.map((item) => item.municipality);
    console.log(options);

    res.status(200).json({ cities: options });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get Provinces controller
async function getBaranggaysController(req, res) {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).send("City parameter is required");
    }

    // Fetch cities based on the provided province
    const baranggays = await GeoTable.findAll({
      where: { municipality: city },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("baranggay")), "baranggay"],
      ],
      order: [["baranggay", "ASC"]],
    });

    if (!baranggays.length) {
      return res
        .status(404)
        .send("No baranggays found for the specified province");
    }

    // Format the result to return only the unique province names
    const options = baranggays.map((item) => item.baranggay);
    console.log(options);

    res.status(200).json({ baranggays: options });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = {
  getProvincesController,
  getCitiesController,
  getBaranggaysController,
};
