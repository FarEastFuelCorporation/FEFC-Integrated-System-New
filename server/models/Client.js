const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");

// Path to the default image
const DEFAULT_IMAGE_PATH = path.join(
  __dirname,
  "../../public/assets/unknown.png"
);

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(), // Generate UUID automatically
      allowNull: false,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    natureOfBusiness: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientType: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [
          ["GENERATOR", "TRANSPORTER", "INTEGRATED FACILITIES MANAGEMENT"],
        ],
      },
    },
    billerName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerContactPerson: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billerContactNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientPicture: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"), // Default value set to current timestamp
      get() {
        const rawValue = this.getDataValue("createdAt");
        return moment(rawValue).tz("Asia/Singapore").format();
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"), // Default value set to current timestamp
      get() {
        const rawValue = this.getDataValue("updatedAt");
        return moment(rawValue).tz("Asia/Singapore").format();
      },
    },
    // Paranoid option for soft deletion
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      get() {
        const rawValue = this.getDataValue("deletedAt");
        return rawValue ? moment(rawValue).tz("Asia/Singapore").format() : null;
      },
    },
  },
  {
    // Enable soft deletion (paranoid mode)
    paranoid: true,
    hooks: {
      beforeCreate: async (client, options) => {
        // Set createdAt and updatedAt to current timestamp on creation
        const currentTime = moment().tz("Asia/Singapore").format();
        client.createdAt = currentTime;
        client.updatedAt = currentTime;

        // Set default clientPicture if not provided
        if (!client.clientPicture) {
          try {
            const defaultImage = fs.readFileSync(DEFAULT_IMAGE_PATH);
            client.clientPicture = defaultImage;
          } catch (error) {
            console.error("Error reading default image:", error);
          }
        }
      },
      beforeUpdate: (client, options) => {
        // Set updatedAt to current timestamp on update
        client.updatedAt = moment().tz("Asia/Singapore").format();
      },
    },
  }
);

module.exports = Client;
