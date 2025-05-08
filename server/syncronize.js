// ./syncronize

const cron = require("node-cron");
const IdInformationLocal = require("./modelsLocal/IdInformationLocal");
const IdInformation = require("./models/IdInformation");
const AttendanceLocal = require("./modelsLocal/AttendanceLocal");
const Attendance = require("./models/Attendance");
const Violation = require("./models/Violation");
const ViolationLocal = require("./modelsLocal/ViolationLocal");
const ViolationList = require("./models/ViolationList");
const ViolationListLocal = require("./modelsLocal/ViolationListLocal");

// Function to sync `IdInformation` to `IdInformationLocal`
async function syncIdInformationToLocal() {
  try {
    const batchSize = 10;

    // Step 1: Get all employee_ids from cloud and local
    const cloudIdsRaw = await IdInformation.findAll({
      attributes: ["employee_id"],
    });
    const localIdsRaw = await IdInformationLocal.findAll({
      attributes: ["employee_id"],
    });

    const cloudIds = cloudIdsRaw.map((r) => r.employee_id);
    const localIdsSet = new Set(localIdsRaw.map((r) => r.employee_id));

    // Step 2: Determine missing and existing IDs
    const idsToInsert = cloudIds.filter((id) => !localIdsSet.has(id));
    const idsToUpdate = cloudIds.filter((id) => localIdsSet.has(id));

    console.log(
      `Found ${idsToInsert.length} new records and ${idsToUpdate.length} to update.`
    );

    // Helper to fetch full records in batch by employee_ids
    const fetchCloudRecordsByIds = async (idsBatch) => {
      return await IdInformation.findAll({ where: { employee_id: idsBatch } });
    };

    // Step 3: Process INSERTS by batch
    for (let i = 0; i < idsToInsert.length; i += batchSize) {
      const batchIds = idsToInsert.slice(i, i + batchSize);
      const records = await fetchCloudRecordsByIds(batchIds);

      await IdInformationLocal.bulkCreate(records.map((item) => item.toJSON()));
      console.log(`Inserted ${records.length} records.`);
    }

    // Step 4: Process UPDATES by batch
    // for (let i = 0; i < idsToUpdate.length; i += batchSize) {
    //   const batchIds = idsToUpdate.slice(i, i + batchSize);
    //   const records = await fetchCloudRecordsByIds(batchIds);

    //   const updates = records.map((item) => item.toJSON());

    //   for (const record of updates) {
    //     await IdInformationLocal.upsert(record); // performs insert or update
    //   }

    //   console.log(`Upserted ${updates.length} records.`);
    // }

    console.log("✅ Sync complete.");
  } catch (error) {
    console.error(
      "❌ Error syncing IdInformation to IdInformationLocal:",
      error
    );
  }
}

// Function to sync `ViolationList` to `ViolationListLocal`
async function syncViolationListToLocal() {
  try {
    // Fetch all records from the cloud ViolationList table
    const cloudData = await ViolationList.findAll();

    // Create a set of violation_ids from cloud data for quick lookup
    const cloudIds = new Set(cloudData.map((item) => item.violation_id));

    // Fetch existing records from the local ViolationListLocal table
    const existingLocalRecords = await ViolationListLocal.findAll({
      where: { violation_id: Array.from(cloudIds) },
    });

    // Create a map of existing local records by violation_id for quick lookup
    const localRecordsMap = new Map(
      existingLocalRecords.map((record) => [record.violation_id, record])
    );

    const updates = [];
    const newRecords = [];

    // Iterate through cloud data to determine updates and new inserts
    cloudData.forEach((item) => {
      const localRecord = localRecordsMap.get(item.violation_id);

      if (localRecord) {
        // Prepare update for existing local record
        updates.push({
          violation_id: item.violation_id,
          description: item.description,
        });
      } else {
        // Add to new records if not found in local
        newRecords.push(item);
      }
    });

    // If updates are found, use bulkCreate with updateOnDuplicate
    if (updates.length > 0) {
      await ViolationListLocal.bulkCreate(updates, {
        updateOnDuplicate: ["description"], // Specify fields to update
      });
      console.log(
        `Updated ${updates.length} existing records in ViolationListLocal.`
      );
    } else {
      console.log("No existing records to update.");
    }

    // If new records are found, insert them into ViolationListLocal
    if (newRecords.length > 0) {
      await ViolationListLocal.bulkCreate(newRecords);
      console.log(
        `Inserted ${newRecords.length} new records into ViolationListLocal.`
      );
    } else {
      console.log("No new records to insert.");
    }
  } catch (error) {
    console.error("Error syncing ViolationList to ViolationListLocal:", error);
  }
}

// Function to sync `Violation` to `ViolationLocal`
async function syncViolationToLocal() {
  try {
    // Fetch all records from the cloud Violation table
    const cloudData = await Violation.findAll();

    // Fetch existing records from the local ViolationLocal table
    const existingLocalRecords = await ViolationLocal.findAll();

    // Create a map of existing local records by their IDs for quick lookup
    const localRecordsMap = new Map(
      existingLocalRecords.map((record) => [record.id, record])
    );

    const updates = [];
    const newRecords = [];

    // Iterate through cloud data to determine updates and new inserts
    cloudData.forEach((item) => {
      const localRecord = localRecordsMap.get(item.id);

      if (localRecord) {
        // Update existing local record
        updates.push({
          id: item.id,
          employee_id: item.employee_id,
          violation_id: item.violation_id,
          updatedAt: new Date(), // assuming you want to update the timestamp
        });
      } else {
        // Add to new records if not found in local
        newRecords.push(item);
      }
    });

    // If updates are found, use bulkCreate with updateOnDuplicate
    if (updates.length > 0) {
      await ViolationLocal.bulkCreate(updates, {
        updateOnDuplicate: ["employee_id", "violation_id", "updatedAt"], // Specify fields to update
      });
      console.log(
        `Updated ${updates.length} existing records in ViolationLocal.`
      );
    } else {
      console.log("No existing records to update.");
    }

    // If new records are found, insert them into ViolationLocal
    if (newRecords.length > 0) {
      await ViolationLocal.bulkCreate(newRecords);
      console.log(
        `Inserted ${newRecords.length} new records into ViolationLocal.`
      );
    } else {
      console.log("No new records to insert.");
    }
  } catch (error) {
    console.error("Error syncing Violation to ViolationLocal:", error);
  }
}

// Function to sync unsynced AttendanceLocal records to Attendance
async function syncUnsyncedAttendance() {
  try {
    // Fetch unsynced records from AttendanceLocal
    const unsyncedRecords = await AttendanceLocal.findAll({
      where: { synced: false }, // Only get records that have not been synced
    });

    if (unsyncedRecords.length === 0) {
      console.log("No unsynced attendance records found.");
      return;
    }

    // Prepare data for bulk create without including the primary key
    const recordsToSync = unsyncedRecords.map((record) => ({
      employee_id: record.employee_id, // Only include necessary fields
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      // No need to include `id` since it's auto-incremented
    }));

    // Perform bulk create in Attendance
    await Attendance.bulkCreate(recordsToSync, {
      ignoreDuplicates: true, // Prevent errors on primary key conflicts
    });

    // Mark these records as synced in AttendanceLocal
    await AttendanceLocal.update(
      { synced: true }, // Update the synced status
      { where: { id: unsyncedRecords.map((record) => record.id) } } // Mark records as synced
    );

    console.log(
      `Successfully synced ${recordsToSync.length} attendance records.`
    );
  } catch (error) {
    console.error("Error during attendance sync:", error);
  }
}

async function handleAttendanceSync() {
  console.log("Syncing unsynced attendance records in real-time");
  try {
    await syncUnsyncedAttendance();
  } catch (error) {
    console.error("Error during attendance sync:", error);
    // You can log the error to a file, send a notification, etc.
  }
}

async function syncSpecificEmployeeToLocal(employeeId) {
  try {
    // Fetch data from the cloud IdInformation table for a specific employee_id
    const cloudData = await IdInformation.findOne({
      where: { employee_id: employeeId },
      attributes: [
        "employee_id",
        "first_name",
        "middle_name",
        "last_name",
        "affix",
        "type_of_employee",
        "designation",
        "url",
        "birthday",
        "contact_number",
        "address",
        "sss_no",
        "pag_ibig_no",
        "philhealth_no",
        "tin_no",
        "contact_person",
        "contact_person_number",
        "contact_person_address",
        "address2",
        "contact_person_address2",
        "date_expire",
        "profile_picture",
        "signature",
      ],
    });

    if (!cloudData) {
      console.log(`No data found in the cloud for employee_id ${employeeId}`);
      return;
    }

    // Check if the employee already exists in the local IdInformationLocal table
    const existingLocalRecord = await IdInformationLocal.findOne({
      where: { employee_id: employeeId },
    });

    if (existingLocalRecord) {
      // Update the existing record
      await existingLocalRecord.update(cloudData.toJSON());
      console.log(
        `Updated record for employee_id ${employeeId} in IdInformationLocal.`
      );
    } else {
      // Insert new record if it doesn't exist locally
      await IdInformationLocal.create(cloudData.toJSON());
      console.log(
        `Inserted new record for employee_id ${employeeId} in IdInformationLocal.`
      );
    }
  } catch (error) {
    console.error(
      `Error syncing IdInformation for employee_id ${employeeId} to IdInformationLocal:`,
      error
    );
  }
}

// Usage: Call the function with the specific employee_id you want to sync

module.exports = {
  syncIdInformationToLocal,
  syncSpecificEmployeeToLocal,
  syncViolationListToLocal,
  syncViolationToLocal,
  syncUnsyncedAttendance,
  handleAttendanceSync,
};
