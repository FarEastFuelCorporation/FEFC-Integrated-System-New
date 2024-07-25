import { useState, useEffect } from "react";
import { Box, IconButton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Header from "../Header";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../../../../theme";
import EmployeeRecordModal from "../../../../../OtherComponents/Modals/EmployeeRecordModal";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";

const Contacts = ({ user }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const initialFormData = {
    id: "",
    employeeId: "",
    employeeStatus: "ACTIVE",
    firstName: "",
    middleName: "",
    lastName: "",
    husbandSurname: "",
    affix: "",
    gender: "",
    civilStatus: "",
    birthday: "",
    birthPlace: "",
    bloodType: "",
    ethnicOrigin: "",
    citizenship: "",
    religion: "",
    province: "",
    municipality: "",
    barangay: "",
    address: "",
    otherProvince: "",
    otherMunicipality: "",
    otherBarangay: "",
    otherAddress: "",
    mobileNumber: "",
    landlineNumber: "",
    emailAddress: "",
    dateHire: "",
    employeeType: "",
    payrollType: "",
    salaryType: "",
    designation: "",
    departmentId: "",
    immediateHeadId: "",
    tinId: "",
    philhealthId: "",
    sssId: "",
    pagibigId: "",
    fathersName: "",
    fathersReligion: "",
    fathersAddress: "",
    fathersMobileNumber: "",
    mothersName: "",
    mothersReligion: "",
    mothersAddress: "",
    mothersMobileNumber: "",
    spouseName: "",
    spouseReligion: "",
    spouseAddress: "",
    spouseMobileNumber: "",
    educationalAttainment: "",
    schoolName: "",
    course: "",
    level: "",
    year: "",
    referenceName: "",
    referenceAddress: "",
    referenceMobileNumber: "",
    emergencyName: "",
    emergencyAddress: "",
    emergencyMobileNumber: "",
    picture: null,
    signature: null,
    createdBy: user.id,
  };

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [employeeRecords, setEmployeeRecord] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureFileName, setPictureFileName] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [signatureFileName, setSignatureFileName] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeRecordResponse] = await Promise.all([
          axios.get(`${apiUrl}/employeeRecord`),
        ]);

        console.log(employeeRecordResponse.data.employeeRecords);
        setEmployeeRecord(employeeRecordResponse.data.employeeRecords);
      } catch (error) {
        console.error("Error fetching employeeData:", error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentStep(0);
  };

  const clearFormData = () => {
    setFormData(initialFormData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (id) => {
    const employeeRecord = employeeRecords.find((record) => record.id === id);
    if (employeeRecord) {
      setFormData({
        id: employeeRecord.id,
        employeeId: employeeRecord.employeeId,
        employeeStatus: employeeRecord.employeeStatus,
        firstName: employeeRecord.firstName,
        middleName: employeeRecord.middleName,
        lastName: employeeRecord.lastName,
        husbandSurname: employeeRecord.husbandSurname,
        affix: employeeRecord.affix,
        gender: employeeRecord.gender,
        civilStatus: employeeRecord.civilStatus,
        birthday: employeeRecord.birthday,
        birthPlace: employeeRecord.birthPlace,
        bloodType: employeeRecord.bloodType,
        ethnicOrigin: employeeRecord.ethnicOrigin,
        citizenship: employeeRecord.citizenship,
        religion: employeeRecord.religion,
        province: employeeRecord.province,
        municipality: employeeRecord.municipality,
        barangay: employeeRecord.barangay,
        address: employeeRecord.address,
        otherProvince: employeeRecord.otherProvince,
        otherMunicipality: employeeRecord.otherMunicipality,
        otherBarangay: employeeRecord.otherBarangay,
        otherAddress: employeeRecord.otherAddress,
        mobileNumber: employeeRecord.mobileNumber,
        landlineNumber: employeeRecord.landlineNumber,
        emailAddress: employeeRecord.emailAddress,
        dateHire: employeeRecord.dateHire,
        employeeType: employeeRecord.employeeType,
        payrollType: employeeRecord.payrollType,
        salaryType: employeeRecord.salaryType,
        designation: employeeRecord.designation,
        departmentId: employeeRecord.departmentId,
        immediateHeadId: employeeRecord.immediateHeadId,
        tinId: employeeRecord.tinId,
        philhealthId: employeeRecord.philhealthId,
        sssId: employeeRecord.sssId,
        pagibigId: employeeRecord.pagibigId,
        fathersName: employeeRecord.fathersName,
        fathersReligion: employeeRecord.fathersReligion,
        fathersAddress: employeeRecord.fathersAddress,
        fathersMobileNumber: employeeRecord.fathersMobileNumber,
        mothersName: employeeRecord.mothersName,
        mothersReligion: employeeRecord.mothersReligion,
        mothersAddress: employeeRecord.mothersAddress,
        mothersMobileNumber: employeeRecord.mothersMobileNumber,
        spouseName: employeeRecord.spouseName,
        spouseReligion: employeeRecord.spouseReligion,
        spouseAddress: employeeRecord.spouseAddress,
        spouseMobileNumber: employeeRecord.spouseMobileNumber,
        educationalAttainment: employeeRecord.educationalAttainment,
        schoolName: employeeRecord.schoolName,
        course: employeeRecord.course,
        level: employeeRecord.level,
        year: employeeRecord.year,
        referenceName: employeeRecord.referenceName,
        referenceAddress: employeeRecord.referenceAddress,
        referenceMobileNumber: employeeRecord.referenceMobileNumber,
        emergencyName: employeeRecord.emergencyName,
        emergencyAddress: employeeRecord.emergencyAddress,
        emergencyMobileNumber: employeeRecord.emergencyMobileNumber,
        picture: employeeRecord.picture,
        signature: employeeRecord.signature,
        createdAt: employeeRecord.createdAt,
        createdBy: employeeRecord.createdBy,
        updatedAt: employeeRecord.updatedAt,
        updatedBy: employeeRecord.updatedBy,
        deletedAt: employeeRecord.deletedAt,
        deletedBy: employeeRecord.deletedBy,
      });
      handleOpenModal();
    } else {
      console.error(`Employee Record with ID ${id} not found for editing.`);
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPictureFile(file);
      console.log(file);
      console.log(file.name);
      setPictureFileName(file.name);
    }
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSignatureFile(file);
      setSignatureFileName(file.name);
    }
  };

  const validateForm = () => {
    let errors = [];

    // Destructure formData for easier validation
    const {
      employeeId,
      gender,
      civilStatus,
      firstName,
      lastName,
      birthday,
      birthPlace,
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
    } = formData;

    if (!employeeId) errors.push("Employee Id is required");
    if (!gender) errors.push("Gender is required");
    if (!civilStatus) errors.push("Civil Status is required");
    if (!firstName) errors.push("First Name is required");
    if (!lastName) errors.push("Last Name is required");
    if (!birthday) errors.push("Birthday is required");
    if (!birthPlace) errors.push("Place of Birth is required");
    if (!citizenship) errors.push("Citizenship is required");
    if (!religion) errors.push("Religion is required");
    if (!province) errors.push("Province is required");
    if (!municipality) errors.push("City/Municipality is required");
    if (!barangay) errors.push("Barangay is required");
    if (!address) errors.push("House No./Street Name is required");
    if (!otherProvince) errors.push("Other Province is required");
    if (!otherMunicipality) errors.push("Other City/Municipality is required");
    if (!otherBarangay) errors.push("Other Barangay is required");
    if (!otherAddress) errors.push("Other House No./Street Name is required");
    if (!mobileNumber) errors.push("Mobile Number is required");
    if (!emailAddress) errors.push("Email Address is required");

    // Newly added required fields validation
    if (!dateHire) errors.push("Date of Hire is required");
    if (!employeeType) errors.push("Employee Type is required");
    if (!payrollType) errors.push("Payroll Type is required");
    if (!salaryType) errors.push("Salary Type is required");
    if (!designation) errors.push("Designation is required");
    if (!departmentId) errors.push("Department is required");
    if (!immediateHeadId) errors.push("Immediate Head is required");
    if (!tinId) errors.push("TIN ID # is required");
    if (!philhealthId) errors.push("Philhealth ID # is required");
    if (!sssId) errors.push("SSS ID # is required");
    if (!pagibigId) errors.push("Pag-ibig ID # is required");

    // Father's Information validation
    if (!fathersName) errors.push("Father's Name is required");
    if (!fathersReligion) errors.push("Father's Religion is required");
    if (!fathersAddress) errors.push("Father's Address is required");
    if (!fathersMobileNumber) errors.push("Father's Mobile Number is required");

    // Mother's Information validation
    if (!mothersName) errors.push("Mother's Name is required");
    if (!mothersReligion) errors.push("Mother's Religion is required");
    if (!mothersAddress) errors.push("Mother's Address is required");
    if (!mothersMobileNumber) errors.push("Mother's Mobile Number is required");

    // Spouse Information validation (if married)
    if (civilStatus === "MARRIED") {
      if (!spouseName)
        errors.push(
          `${gender === "MALE" ? "Wife's" : "Husband's"} Name is required`
        );
      if (!spouseReligion)
        errors.push(
          `${gender === "MALE" ? "Wife's" : "Husband's"} Religion is required`
        );
      if (!spouseAddress)
        errors.push(
          `${gender === "MALE" ? "Wife's" : "Husband's"} Address is required`
        );
      if (!spouseMobileNumber)
        errors.push(
          `${
            gender === "MALE" ? "Wife's" : "Husband's"
          } Mobile Number is required`
        );
    }

    // Educational Attainment validation
    if (!educationalAttainment)
      errors.push("Educational Attainment is required");
    if (!schoolName) errors.push("School Name is required");
    if (!course) errors.push("Course is required");
    if (!level) errors.push("Level is required");
    if (!year) errors.push("Year is required");

    // Reference Information validation
    if (!referenceName) errors.push("Reference Name is required");
    if (!referenceAddress) errors.push("Reference Address is required");
    if (!referenceMobileNumber)
      errors.push("Reference Mobile Number is required");

    // Emergency Contact validation
    if (!emergencyName) errors.push("Emergency Contact Name is required");
    if (!emergencyAddress) errors.push("Emergency Contact Address is required");
    if (!emergencyMobileNumber)
      errors.push("Emergency Contact Mobile Number is required");

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      setShowErrorMessage(true);
      return false;
    }
    console.log(errors);
    setShowErrorMessage(false);
    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log("pass");

    // Perform client-side validation
    if (!validateForm()) {
      return;
    }
    console.log(formData);

    try {
      const formDataToSend = new FormData();

      // Append form data fields to FormData object
      formDataToSend.append("employeeId", formData.employeeId);
      formDataToSend.append("employeeStatus", formData.employeeStatus);
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("middleName", formData.middleName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("husbandSurname", formData.husbandSurname);
      formDataToSend.append("affix", formData.affix);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("civilStatus", formData.civilStatus);
      formDataToSend.append("birthday", formData.birthday);
      formDataToSend.append("birthPlace", formData.birthPlace);
      formDataToSend.append("bloodType", formData.bloodType);
      formDataToSend.append("ethnicOrigin", formData.ethnicOrigin);
      formDataToSend.append("citizenship", formData.citizenship);
      formDataToSend.append("religion", formData.religion);
      formDataToSend.append("province", formData.province);
      formDataToSend.append("municipality", formData.municipality);
      formDataToSend.append("barangay", formData.barangay);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("otherProvince", formData.otherProvince);
      formDataToSend.append("otherMunicipality", formData.otherMunicipality);
      formDataToSend.append("otherBarangay", formData.otherBarangay);
      formDataToSend.append("otherAddress", formData.otherAddress);
      formDataToSend.append("mobileNumber", formData.mobileNumber);
      formDataToSend.append("landlineNumber", formData.landlineNumber);
      formDataToSend.append("emailAddress", formData.emailAddress);
      formDataToSend.append("dateHire", formData.dateHire);
      formDataToSend.append("employeeType", formData.employeeType);
      formDataToSend.append("payrollType", formData.payrollType);
      formDataToSend.append("salaryType", formData.salaryType);
      formDataToSend.append("designation", formData.designation);
      formDataToSend.append("departmentId", formData.departmentId.id);
      formDataToSend.append(
        "immediateHeadId",
        formData.immediateHeadId.employeeId
      );
      formDataToSend.append("tinId", formData.tinId);
      formDataToSend.append("philhealthId", formData.philhealthId);
      formDataToSend.append("sssId", formData.sssId);
      formDataToSend.append("pagibigId", formData.pagibigId);
      formDataToSend.append("fathersName", formData.fathersName);
      formDataToSend.append("fathersReligion", formData.fathersReligion);
      formDataToSend.append("fathersAddress", formData.fathersAddress);
      formDataToSend.append(
        "fathersMobileNumber",
        formData.fathersMobileNumber
      );
      formDataToSend.append("mothersName", formData.mothersName);
      formDataToSend.append("mothersReligion", formData.mothersReligion);
      formDataToSend.append("mothersAddress", formData.mothersAddress);
      formDataToSend.append(
        "mothersMobileNumber",
        formData.mothersMobileNumber
      );
      formDataToSend.append("spouseName", formData.spouseName);
      formDataToSend.append("spouseReligion", formData.spouseReligion);
      formDataToSend.append("spouseAddress", formData.spouseAddress);
      formDataToSend.append("spouseMobileNumber", formData.spouseMobileNumber);
      formDataToSend.append(
        "educationalAttainment",
        formData.educationalAttainment
      );
      formDataToSend.append("schoolName", formData.schoolName);
      formDataToSend.append("course", formData.course);
      formDataToSend.append("level", formData.level);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("referenceName", formData.referenceName);
      formDataToSend.append("referenceAddress", formData.referenceAddress);
      formDataToSend.append(
        "referenceMobileNumber",
        formData.referenceMobileNumber
      );
      formDataToSend.append("emergencyName", formData.emergencyName);
      formDataToSend.append("emergencyAddress", formData.emergencyAddress);
      formDataToSend.append(
        "emergencyMobileNumber",
        formData.emergencyMobileNumber
      );
      formDataToSend.append("createdBy", formData.createdBy);

      // Append picture and signature if they are selected
      if (pictureFile) {
        formDataToSend.append("picture", pictureFile);
      }
      if (signatureFile) {
        formDataToSend.append("signature", signatureFile);
      }
      console.log(formDataToSend);
      let response;

      if (formData.id) {
        // Update existing employee record
        response = await axios.put(
          `${apiUrl}/employeeRecord/${formData.id}`,
          formDataToSend
        );
        console.log(response.data.employeeRecord);
        setEmployeeRecord(response.data.employeeRecords);
        setSuccessMessage("Employee Record Updated Successfully!");
      } else {
        // Add new employee record
        response = await axios.post(`${apiUrl}/employeeRecord`, formDataToSend);
        setEmployeeRecord(response.data.employeeRecords);
        setSuccessMessage("Employee Record Added Successfully!");
      }

      clearFormData();
      setErrorMessage("");
      setShowSuccessMessage(true);
      handleCloseModal();
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "employeeId",
      headerName: "Employee ID",
      width: 80,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "picture",
      headerName: "Picture",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 70,
      renderCell: (params) => {
        // Check if params.value is valid
        if (params.value && params.value.data && params.value.type) {
          try {
            // Convert Buffer to Uint8Array
            const uint8Array = new Uint8Array(params.value.data);
            // Create Blob from Uint8Array
            const blob = new Blob([uint8Array], { type: params.value.type });
            // Create object URL from Blob
            const imageUrl = URL.createObjectURL(blob);

            return (
              <img
                src={imageUrl}
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          } catch (error) {
            console.error("Error creating image URL:", error);
            return (
              <img
                src="/assets/unknown.png"
                alt="Logo"
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            );
          }
        } else {
          return (
            <img
              src="/assets/unknown.png"
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: "50%" }}
            />
          );
        }
      },
    },
    {
      field: "employeeStatus",
      headerName: "Status",
      width: 80,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "husbandSurname",
      headerName: "Husband Surname",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "affix",
      headerName: "Affix",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "civilStatus",
      headerName: "Civil Status",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "birthday",
      headerName: "Birthday",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "dateHire",
      headerName: "Date Hire",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "birthPlace",
      headerName: "Birth Place",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "bloodType",
      headerName: "Blood Type",
      width: 120,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "ethnicOrigin",
      headerName: "Ethnic Origin",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "citizenship",
      headerName: "Citizenship",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "religion",
      headerName: "Religion",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "province",
      headerName: "Province",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "municipality",
      headerName: "Municipality",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "barangay",
      headerName: "Barangay",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "otherProvince",
      headerName: "Other Province",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "otherMunicipality",
      headerName: "Other Municipality",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "otherBarangay",
      headerName: "Other Barangay",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "landlineNumber",
      headerName: "Landline Number",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "emailAddress",
      headerName: "Email Address",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "employeeType",
      headerName: "Employee Type",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "payrollType",
      headerName: "Payroll Type",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "salaryType",
      headerName: "Salary Type",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "departmentId",
      headerName: "Department ID",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "immediateHeadId",
      headerName: "Immediate Head ID",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "tinId",
      headerName: "TIN ID",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "philhealthId",
      headerName: "PhilHealth ID",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "sssId",
      headerName: "SSS ID",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "pagibigId",
      headerName: "Pag-IBIG ID",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fathersName",
      headerName: "Father's Name",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fathersReligion",
      headerName: "Father's Religion",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fathersAddress",
      headerName: "Father's Address",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "fathersMobileNumber",
      headerName: "Father's Mobile Number",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "mothersName",
      headerName: "Mother's Name",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "mothersReligion",
      headerName: "Mother's Religion",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "mothersAddress",
      headerName: "Mother's Address",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "mothersMobileNumber",
      headerName: "Mother's Mobile Number",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "spouseName",
      headerName: "Spouse Name",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "spouseReligion",
      headerName: "Spouse Religion",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "spouseAddress",
      headerName: "Spouse Address",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "spouseMobileNumber",
      headerName: "Spouse Mobile Number",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "educationalAttainment",
      headerName: "Educational Attainment",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "schoolName",
      headerName: "School Name",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "course",
      headerName: "Course",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "level",
      headerName: "Level",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "year",
      headerName: "Year",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "emergencyName",
      headerName: "Emergency Name",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "emergencyAddress",
      headerName: "Emergency Address",
      width: 200,
      renderCell: renderCellWithWrapText,
    },
    {
      field: "emergencyMobileNumber",
      headerName: "Emergency Mobile Number",
      width: 150,
      renderCell: renderCellWithWrapText,
    },
  ];

  if (user.userType === 9) {
    columns.push({
      field: "edit",
      headerName: "Edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 60,
      renderCell: (params) => (
        <IconButton
          color="warning"
          onClick={() => handleEditClick(params.row.id)}
        >
          <EditIcon />
        </IconButton>
      ),
    });
  }

  return (
    <Box p="20px" width="100% !important" sx={{ position: "relative" }}>
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Employee Records"
          subtitle="List of Employee for Future Reference"
        />
        {user.userType === 9 && (
          <Box display="flex">
            <IconButton onClick={handleOpenModal}>
              <PostAddIcon sx={{ fontSize: "40px" }} />
            </IconButton>
          </Box>
        )}
      </Box>
      {showSuccessMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setShowSuccessMessage(false)}
        />
      )}
      <Box
        m="40px 0 0 0"
        height="75vh"
        width="100% !important"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            width: "100%",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={employeeRecords ? employeeRecords : []}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <EmployeeRecordModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        formData={formData}
        clearFormData={clearFormData}
        handlePictureChange={handlePictureChange}
        pictureFileName={pictureFileName}
        handleSignatureChange={handleSignatureChange}
        signatureFileName={signatureFileName}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        handleFormSubmit={handleFormSubmit}
        errorMessage={errorMessage}
        showErrorMessage={showErrorMessage}
      />
    </Box>
  );
};

export default Contacts;
