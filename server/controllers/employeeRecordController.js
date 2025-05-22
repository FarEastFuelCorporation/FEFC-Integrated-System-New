// controllers/employeeRecordController.js

const EmployeeAttachment = require("../models/EmployeeAttachment");
const EmployeeAttachmentLegal = require("../models/EmployeeAttachmentLegal");
const EmployeeAttachmentMemo = require("../models/EmployeeAttachmentMemo");
const EmployeeRecord = require("../models/EmployeeRecord");
const IdInformation = require("../models/IdInformation");
const Vehicle = require("../models/Vehicle");

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

    // Convert all string values to uppercase
    const toUpperCase = (value) => (value ? value.toUpperCase() : value);

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
      birthday,
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
      dateHire,
      employeeType: toUpperCase(employeeType),
      payrollType: toUpperCase(payrollType),
      salaryType: toUpperCase(salaryType),
      designation: toUpperCase(designation),
      departmentId: departmentId,
      immediateHeadId: immediateHeadId,
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
      createdBy: toUpperCase(createdBy),
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

// Get EmployeeRecords controller
async function getEmployeeRecordsFullController(req, res) {
  try {
    // Fetch all EmployeeRecords from the database
    const employeeRecords = await EmployeeRecord.findAll({
      attributes: { exclude: ["signature"] },
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
      ],
    });

    res.json({ employeeRecords });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}
// Delete EmployeeRecord controller
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
  getEmployeeRecordsFullController,
  updateEmployeeRecordController,
  deleteEmployeeRecordController,
  getEmployeeRecordSignatureController,
};
