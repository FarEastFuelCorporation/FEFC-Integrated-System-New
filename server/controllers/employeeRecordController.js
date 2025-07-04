// controllers/employeeRecordController.js

const Department = require("../models/Department");
const EmployeeAttachment = require("../models/EmployeeAttachment");
const EmployeeAttachmentCertificate = require("../models/EmployeeAttachmentCertificate");
const EmployeeAttachmentLegal = require("../models/EmployeeAttachmentLegal");
const EmployeeAttachmentMemo = require("../models/EmployeeAttachmentMemo");
const EmployeeContract = require("../models/EmployeeContract");
const EmployeeRecord = require("../models/EmployeeRecord");
const EmployeeSalary = require("../models/EmployeeSalary");
const IdInformation = require("../models/IdInformation");
const Vehicle = require("../models/Vehicle");

const safeToUpperCase = (value) => {
  return typeof value === "string" ? value.toUpperCase() : "";
};

// Create EmployeeRecord controller
async function createEmployeeRecordController(req, res) {
  try {
    // Extracting data from the request body and converting to uppercase
    const {
      employeeId,
      employeeStatus,
      firstName,
      middleName,
      lastName,
      husbandSurname,
      affix,
      gender,
      civilStatus,
      birthday,
      birthPlace,
      bloodType,
      ethnicOrigin,
      citizenship,
      religion,
      province,
      municipality,
      barangay,
      address,
      otherProvince,
      otherMunicipality,
      otherBarangay,
      otherAddress,
      mobileNumber,
      landlineNumber,
      emailAddress,
      dateHire,
      employeeType,
      payrollType,
      salaryType,
      designation,
      departmentId,
      immediateHeadId,
      tinId,
      philhealthId,
      sssId,
      pagibigId,
      fathersName,
      fathersReligion,
      fathersAddress,
      fathersMobileNumber,
      mothersName,
      mothersReligion,
      mothersAddress,
      mothersMobileNumber,
      spouseName,
      spouseReligion,
      spouseAddress,
      spouseMobileNumber,
      educationalAttainment,
      schoolName,
      course,
      level,
      year,
      referenceName,
      referenceAddress,
      referenceMobileNumber,
      emergencyName,
      emergencyAddress,
      emergencyMobileNumber,
      createdBy,
    } = req.body;

    console.log(departmentId);
    console.log(immediateHeadId);

    const data = {
      employeeId: safeToUpperCase(employeeId),
      employeeStatus: safeToUpperCase(employeeStatus),
      firstName: safeToUpperCase(firstName),
      middleName: safeToUpperCase(middleName),
      lastName: safeToUpperCase(lastName),
      husbandSurname: safeToUpperCase(husbandSurname),
      affix: safeToUpperCase(affix),
      gender: safeToUpperCase(gender),
      civilStatus: safeToUpperCase(civilStatus),
      birthday,
      birthPlace: safeToUpperCase(birthPlace),
      bloodType: safeToUpperCase(bloodType),
      ethnicOrigin: safeToUpperCase(ethnicOrigin),
      citizenship: safeToUpperCase(citizenship),
      religion: safeToUpperCase(religion),
      province: safeToUpperCase(province),
      municipality: safeToUpperCase(municipality),
      barangay: safeToUpperCase(barangay),
      address: safeToUpperCase(address),
      otherProvince: safeToUpperCase(otherProvince),
      otherMunicipality: safeToUpperCase(otherMunicipality),
      otherBarangay: safeToUpperCase(otherBarangay),
      otherAddress: safeToUpperCase(otherAddress),
      mobileNumber: safeToUpperCase(mobileNumber),
      landlineNumber: safeToUpperCase(landlineNumber),
      emailAddress: safeToUpperCase(emailAddress),
      dateHire,
      employeeType: safeToUpperCase(employeeType),
      payrollType: safeToUpperCase(payrollType),
      salaryType: safeToUpperCase(salaryType),
      designation: safeToUpperCase(designation),
      departmentId: departmentId,
      immediateHeadId: immediateHeadId,
      tinId: safeToUpperCase(tinId),
      philhealthId: safeToUpperCase(philhealthId),
      sssId: safeToUpperCase(sssId),
      pagibigId: safeToUpperCase(pagibigId),
      fathersName: safeToUpperCase(fathersName),
      fathersReligion: safeToUpperCase(fathersReligion),
      fathersAddress: safeToUpperCase(fathersAddress),
      fathersMobileNumber: safeToUpperCase(fathersMobileNumber),
      mothersName: safeToUpperCase(mothersName),
      mothersReligion: safeToUpperCase(mothersReligion),
      mothersAddress: safeToUpperCase(mothersAddress),
      mothersMobileNumber: safeToUpperCase(mothersMobileNumber),
      spouseName: safeToUpperCase(spouseName),
      spouseReligion: safeToUpperCase(spouseReligion),
      spouseAddress: safeToUpperCase(spouseAddress),
      spouseMobileNumber: safeToUpperCase(spouseMobileNumber),
      educationalAttainment: safeToUpperCase(educationalAttainment),
      schoolName: safeToUpperCase(schoolName),
      course: safeToUpperCase(course),
      level: safeToUpperCase(level),
      year: safeToUpperCase(year),
      referenceName: safeToUpperCase(referenceName),
      referenceAddress: safeToUpperCase(referenceAddress),
      referenceMobileNumber: safeToUpperCase(referenceMobileNumber),
      emergencyName: safeToUpperCase(emergencyName),
      emergencyAddress: safeToUpperCase(emergencyAddress),
      emergencyMobileNumber: safeToUpperCase(emergencyMobileNumber),
      createdBy: safeToUpperCase(createdBy),
    };

    console.log(req.body);

    let picture, signature;

    // Handle file uploads if they are present
    if (req.files && req.files.picture) {
      picture = req.files.picture[0].buffer;
    }
    if (req.files && req.files.signature) {
      signature = req.files.signature[0].buffer;
    }

    // Creating a new employee record
    await EmployeeRecord.create({
      ...data,
      picture,
      signature,
    });

    // Fetch all EmployeeRecords from the database
    const employeeRecords = await EmployeeRecord.findAll({
      attributes: { exclude: ["picture", "signature"] },
      order: [["employeeId", "ASC"]],
      include: [
        {
          model: EmployeeAttachment,
          as: "EmployeeAttachment",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
        {
          model: EmployeeAttachmentLegal,
          as: "EmployeeAttachmentLegal",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
        {
          model: EmployeeAttachmentMemo,
          as: "EmployeeAttachmentMemo",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
        {
          model: EmployeeAttachmentCertificate,
          as: "EmployeeAttachmentCertificate",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
      ],
    });

    // Respond with the newly created employee record and the associated departments
    res.status(201).json({ employeeRecords });
  } catch (error) {
    // Handling errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get EmployeeRecords controller
async function getEmployeeRecordsController(req, res) {
  try {
    // Fetch all EmployeeRecords from the database
    const employeeRecords = await EmployeeRecord.findAll({
      attributes: [
        "id",
        "employeeId",
        "employeeStatus",
        "firstName",
        "middleName",
        "lastName",
        "husbandSurname",
        "affix",
        "gender",
        "civilStatus",
        "birthday",
        "dateHire",
        "employeeType",
        "designation",
        "immediateHeadId",
        "departmentId",
        "mobileNumber",
      ],
      order: [["employeeId", "ASC"]],
      include: [
        {
          model: Department,
          as: "Department",
          attributes: ["department"], // Include only necessary fields
        },
        {
          model: EmployeeContract,
          as: "EmployeeContract",
          attributes: {
            exclude: ["attachment"],
          },
        },
      ],
    });

    // Create a new array with only employeeId and employeeName
    const employees = employeeRecords.map((record) => {
      const employee = record.toJSON();
      return {
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName || ""} ${
          employee.lastName || ""
        }`.trim(),
      };
    });

    res.json({
      employeeRecords,
      employees,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get EmployeeRecord controller
async function getEmployeeRecordController(req, res) {
  try {
    const id = req.params.id;
    // Fetch all EmployeeRecords from the database
    const employeeRecord = await EmployeeRecord.findOne({
      where: { employeeId: id },
      attributes: { exclude: ["signature", "picture"] },
      order: [["employeeId", "ASC"]],
      include: [
        {
          model: EmployeeAttachment,
          as: "EmployeeAttachment",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
        {
          model: EmployeeAttachmentLegal,
          as: "EmployeeAttachmentLegal",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
        {
          model: EmployeeAttachmentMemo,
          as: "EmployeeAttachmentMemo",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
        {
          model: EmployeeAttachmentCertificate,
          as: "EmployeeAttachmentCertificate",
          attributes: ["fileName", "createdBy"], // Include only necessary fields
        },
        {
          model: Department,
          as: "Department",
          attributes: ["department"], // Include only necessary fields
        },
        {
          model: EmployeeContract,
          as: "EmployeeContract",
          attributes: {
            exclude: ["attachment"],
          },
        },
      ],
    });

    res.json({
      employeeRecord,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

// Get EmployeeRecord Picture controller
async function getEmployeeRecordPictureController(req, res) {
  try {
    const id = req.params.id;

    const profile_picture = await IdInformation.findOne({
      where: { employee_id: id },
      attributes: ["profile_picture"],
    });

    res.json({ profile_picture });
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get EmployeeRecord Signature controller
async function getEmployeeRecordSignatureController(req, res) {
  try {
    const id = req.params.id;

    const signature = await IdInformation.findOne({
      where: { employee_id: id },
      attributes: ["signature"],
    });

    res.json({ signature });
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get EmployeeRecord with Salary controller
async function getEmployeeRecordsWithSalaryController(req, res) {
  try {
    const employeeRecords = await EmployeeRecord.findAll({
      attributes: { exclude: ["signature", "picture"] },
      order: [["employeeId", "ASC"]],
      include: [
        {
          model: EmployeeSalary,
          as: "EmployeeSalary",
        },
      ],
    });

    res.json({ employeeRecords });
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Update EmployeeRecord controller
async function updateEmployeeRecordController(req, res) {
  try {
    const id = req.params.id;
    console.log("Updating employee record with ID:", id);
    console.log(req.body);

    const {
      employeeId,
      employeeStatus,
      firstName,
      middleName,
      lastName,
      husbandSurname,
      affix,
      gender,
      civilStatus,
      birthday,
      birthPlace,
      bloodType,
      ethnicOrigin,
      citizenship,
      religion,
      province,
      municipality,
      barangay,
      address,
      otherProvince,
      otherMunicipality,
      otherBarangay,
      otherAddress,
      mobileNumber,
      landlineNumber,
      emailAddress,
      dateHire,
      employeeType,
      payrollType,
      salaryType,
      designation,
      departmentId,
      immediateHeadId,
      tinId,
      philhealthId,
      sssId,
      pagibigId,
      fathersName,
      fathersReligion,
      fathersAddress,
      fathersMobileNumber,
      mothersName,
      mothersReligion,
      mothersAddress,
      mothersMobileNumber,
      spouseName,
      spouseReligion,
      spouseAddress,
      spouseMobileNumber,
      educationalAttainment,
      schoolName,
      course,
      level,
      year,
      referenceName,
      referenceAddress,
      referenceMobileNumber,
      emergencyName,
      emergencyAddress,
      emergencyMobileNumber,
      updatedBy,
    } = req.body;

    // Helper function to convert strings to uppercase
    const toUpperCase = (value) => (value ? value.toUpperCase() : value);

    // Convert string values to uppercase
    const data = {
      employeeId: toUpperCase(employeeId),
      employeeStatus: toUpperCase(employeeStatus),
      firstName: toUpperCase(firstName),
      middleName: toUpperCase(middleName),
      lastName: toUpperCase(lastName),
      husbandSurname: toUpperCase(husbandSurname),
      affix: toUpperCase(affix),
      gender: toUpperCase(gender),
      civilStatus: toUpperCase(civilStatus),
      birthday: new Date(birthday),
      birthPlace: toUpperCase(birthPlace),
      bloodType: toUpperCase(bloodType),
      ethnicOrigin: toUpperCase(ethnicOrigin),
      citizenship: toUpperCase(citizenship),
      religion: toUpperCase(religion),
      province: toUpperCase(province),
      municipality: toUpperCase(municipality),
      barangay: toUpperCase(barangay),
      address: toUpperCase(address),
      otherProvince: toUpperCase(otherProvince),
      otherMunicipality: toUpperCase(otherMunicipality),
      otherBarangay: toUpperCase(otherBarangay),
      otherAddress: toUpperCase(otherAddress),
      mobileNumber: toUpperCase(mobileNumber),
      landlineNumber: toUpperCase(landlineNumber),
      emailAddress: toUpperCase(emailAddress),
      dateHire: new Date(dateHire),
      employeeType: toUpperCase(employeeType),
      payrollType: toUpperCase(payrollType),
      salaryType: toUpperCase(salaryType),
      designation: toUpperCase(designation),
      departmentId: departmentId.departmentId
        ? departmentId.departmentId
        : departmentId,
      immediateHeadId: immediateHeadId.immediateHeadId
        ? immediateHeadId.immediateHeadId
        : immediateHeadId,
      tinId: toUpperCase(tinId),
      philhealthId: toUpperCase(philhealthId),
      sssId: toUpperCase(sssId),
      pagibigId: toUpperCase(pagibigId),
      fathersName: toUpperCase(fathersName),
      fathersReligion: toUpperCase(fathersReligion),
      fathersAddress: toUpperCase(fathersAddress),
      fathersMobileNumber: toUpperCase(fathersMobileNumber),
      mothersName: toUpperCase(mothersName),
      mothersReligion: toUpperCase(mothersReligion),
      mothersAddress: toUpperCase(mothersAddress),
      mothersMobileNumber: toUpperCase(mothersMobileNumber),
      spouseName: toUpperCase(spouseName),
      spouseReligion: toUpperCase(spouseReligion),
      spouseAddress: toUpperCase(spouseAddress),
      spouseMobileNumber: toUpperCase(spouseMobileNumber),
      educationalAttainment: toUpperCase(educationalAttainment),
      schoolName: toUpperCase(schoolName),
      course: toUpperCase(course),
      level: toUpperCase(level),
      year: toUpperCase(year),
      referenceName: toUpperCase(referenceName),
      referenceAddress: toUpperCase(referenceAddress),
      referenceMobileNumber: toUpperCase(referenceMobileNumber),
      emergencyName: toUpperCase(emergencyName),
      emergencyAddress: toUpperCase(emergencyAddress),
      emergencyMobileNumber: toUpperCase(emergencyMobileNumber),
      updatedBy: toUpperCase(updatedBy),
    };

    // Find the employee record by ID and update it
    const employeeRecord = await EmployeeRecord.findByPk(id);

    if (employeeRecord) {
      // Update employee attributes
      Object.assign(employeeRecord, data);

      // Handle file uploads if they are present
      if (req.files && req.files.picture) {
        employeeRecord.picture = req.files.picture[0].buffer;
      }
      if (req.files && req.files.signature) {
        employeeRecord.signature = req.files.signature[0].buffer;
      }

      // Save the updated employee record
      await employeeRecord.save();

      // Fetch all EmployeeRecords from the database
      const employeeRecords = await EmployeeRecord.findAll({
        attributes: { exclude: ["picture", "signature"] },
        order: [["employeeId", "ASC"]],
        include: [
          {
            model: EmployeeAttachment,
            as: "EmployeeAttachment",
            attributes: ["fileName", "createdBy"], // Include only necessary fields
          },
          {
            model: EmployeeAttachmentLegal,
            as: "EmployeeAttachmentLegal",
            attributes: ["fileName", "createdBy"], // Include only necessary fields
          },
          {
            model: EmployeeAttachmentMemo,
            as: "EmployeeAttachmentMemo",
            attributes: ["fileName", "createdBy"], // Include only necessary fields
          },
          {
            model: EmployeeAttachmentCertificate,
            as: "EmployeeAttachmentCertificate",
            attributes: ["fileName", "createdBy"], // Include only necessary fields
          },
        ],
      });

      console.log(employeeRecords);

      // Respond with the updated employee record data
      res.json({ employeeRecords });
    } else {
      // If employee record with the specified ID was not found
      res
        .status(404)
        .json({ message: `Employee record with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating employee record:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete EmployeeRecord controller
async function deleteEmployeeRecordController(req, res) {
  try {
    const id = req.params.id;
    const { deletedBy } = req.body;

    console.log("Soft deleting Vehicle with ID:", id);

    // Find the Vehicle by ID
    const vehicleToDelete = await Vehicle.findByPk(id);

    if (vehicleToDelete) {
      // Update the deletedBy field
      vehicleToDelete.updatedBy = deletedBy;
      vehicleToDelete.deletedBy = deletedBy;
      await vehicleToDelete.save();

      // Soft delete the VehicleType (sets deletedAt timestamp)
      await vehicleToDelete.destroy();

      // Respond with a success message
      res.json({
        message: `Vehicle with ID ${id} soft-deleted successfully`,
      });
    } else {
      // If Vehicle with the specified ID was not found
      res.status(404).json({ message: `Vehicle with ID ${id} not found` });
    }
  } catch (error) {
    // Handle errors
    console.error("Error soft-deleting Vehicle:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createEmployeeRecordController,
  getEmployeeRecordsController,
  getEmployeeRecordController,
  getEmployeeRecordPictureController,
  getEmployeeRecordsWithSalaryController,
  updateEmployeeRecordController,
  deleteEmployeeRecordController,
  getEmployeeRecordSignatureController,
};
