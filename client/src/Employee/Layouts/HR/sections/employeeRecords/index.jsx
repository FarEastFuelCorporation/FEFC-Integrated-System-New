import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Header from "../Header";
import axios from "axios";
import PageviewIcon from "@mui/icons-material/Pageview";
import Tree from "react-d3-tree";
import EmployeeRecordModal from "../../../../../OtherComponents/Modals/EmployeeRecordModal";
import SuccessMessage from "../../../../../OtherComponents/SuccessMessage";
import CustomDataGridStyles from "../../../../../OtherComponents/CustomDataGridStyles";
import EmployeeProfileModal from "../../../../../OtherComponents/Modals/EmployeeProfileModal";
import LoadingSpinner from "../../../../../OtherComponents/LoadingSpinner";
import { tokens } from "../../../../../theme";
import { useTheme } from "@emotion/react";

function buildTree(list) {
  const map = {};
  const roots = [];

  list.forEach((emp) => {
    map[emp.employeeId] = { ...emp, children: [] };
  });

  list.forEach((emp) => {
    if (emp.employeeStatus === "ACTIVE") {
      if (emp.immediateHeadId && map[emp.immediateHeadId]) {
        map[emp.immediateHeadId].children.push(map[emp.employeeId]);
      } else {
        roots.push(map[emp.employeeId]);
      }
    }
  });

  return roots[0]; // assuming one root
}

const EmployeeRecords = ({ user }) => {
  const apiUrl = useMemo(() => process.env.REACT_APP_API_URL, []);
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
  const [selectedTabMain, setSelectedTabMain] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [orgData, setOrgData] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [selectedTab, setSelectedTab] = useState(0);
  const [employeeRecords, setEmployeeRecord] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(formData.gender);
  const [civilStatus, setCivilStatus] = useState(formData.civilStatus);
  const [pictureFile, setPictureFile] = useState(null);
  const [pictureFileName, setPictureFileName] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [signatureFileName, setSignatureFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRowId, setLoadingRowId] = useState(null);
  const [row, setViewData] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const employeeRecordResponse = await axios.get(
        `${apiUrl}/api/employeeRecord`
      );

      setEmployeeRecord(employeeRecordResponse.data.employeeRecords);

      const orgData = buildTree(employeeRecordResponse.data.employeeRecords);

      setOrgData(orgData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching employeeData:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangeTabMain = (event, newValue) => {
    setSelectedTabMain(newValue);
  };

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
    setGender(selectedRow.gender);
    setCivilStatus(selectedRow.civilStatus);
    setPictureFileName("");
    setSignatureFile("");

    if (selectedRow) {
      setFormData({
        id: selectedRow.id,
        employeeId: selectedRow.employeeId,
        employeeStatus: selectedRow.employeeStatus,
        firstName: selectedRow.firstName,
        middleName: selectedRow.middleName,
        lastName: selectedRow.lastName,
        husbandSurname: selectedRow.husbandSurname,
        affix: selectedRow.affix,
        gender: selectedRow.gender,
        civilStatus: selectedRow.civilStatus,
        birthday: selectedRow.birthday,
        birthPlace: selectedRow.birthPlace,
        bloodType: selectedRow.bloodType,
        ethnicOrigin: selectedRow.ethnicOrigin,
        citizenship: selectedRow.citizenship,
        religion: selectedRow.religion,
        province: selectedRow.province,
        municipality: selectedRow.municipality,
        barangay: selectedRow.barangay,
        address: selectedRow.address,
        otherProvince: selectedRow.otherProvince,
        otherMunicipality: selectedRow.otherMunicipality,
        otherBarangay: selectedRow.otherBarangay,
        otherAddress: selectedRow.otherAddress,
        mobileNumber: selectedRow.mobileNumber,
        landlineNumber: selectedRow.landlineNumber,
        emailAddress: selectedRow.emailAddress,
        dateHire: selectedRow.dateHire,
        employeeType: selectedRow.employeeType,
        payrollType: selectedRow.payrollType,
        salaryType: selectedRow.salaryType,
        designation: selectedRow.designation,
        departmentId: selectedRow.departmentId,
        immediateHeadId: selectedRow.immediateHeadId,
        tinId: selectedRow.tinId,
        philhealthId: selectedRow.philhealthId,
        sssId: selectedRow.sssId,
        pagibigId: selectedRow.pagibigId,
        fathersName: selectedRow.fathersName,
        fathersReligion: selectedRow.fathersReligion,
        fathersAddress: selectedRow.fathersAddress,
        fathersMobileNumber: selectedRow.fathersMobileNumber,
        mothersName: selectedRow.mothersName,
        mothersReligion: selectedRow.mothersReligion,
        mothersAddress: selectedRow.mothersAddress,
        mothersMobileNumber: selectedRow.mothersMobileNumber,
        spouseName: selectedRow.spouseName,
        spouseReligion: selectedRow.spouseReligion,
        spouseAddress: selectedRow.spouseAddress,
        spouseMobileNumber: selectedRow.spouseMobileNumber,
        educationalAttainment: selectedRow.educationalAttainment,
        schoolName: selectedRow.schoolName,
        course: selectedRow.course,
        level: selectedRow.level,
        year: selectedRow.year,
        referenceName: selectedRow.referenceName,
        referenceAddress: selectedRow.referenceAddress,
        referenceMobileNumber: selectedRow.referenceMobileNumber,
        emergencyName: selectedRow.emergencyName,
        emergencyAddress: selectedRow.emergencyAddress,
        emergencyMobileNumber: selectedRow.emergencyMobileNumber,
        picture: selectedRow.picture,
        signature: selectedRow.signature,
        createdAt: selectedRow.createdAt,
        createdBy: selectedRow.createdBy,
        updatedAt: selectedRow.updatedAt,
        updatedBy: selectedRow.updatedBy,
        deletedAt: selectedRow.deletedAt,
        deletedBy: selectedRow.deletedBy,
      });
      handleOpenModal();
    } else {
      console.error(`Employee Record with ID ${id} not found for editing.`);
    }
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value;
    setGender(selectedGender);
    handleInputChange(event);
  };

  const handleCivilStatusChange = (event) => {
    const selectedCivilStatus = event.target.value;
    setCivilStatus(selectedCivilStatus);
    handleInputChange(event);
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPictureFile(file);
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
    // if (!birthPlace) errors.push("Place of Birth is required");
    // if (!citizenship) errors.push("Citizenship is required");
    // if (!religion) errors.push("Religion is required");
    // if (!province) errors.push("Province is required");
    // if (!municipality) errors.push("City/Municipality is required");
    // if (!barangay) errors.push("Barangay is required");
    // if (!address) errors.push("House No./Street Name is required");
    // if (!otherProvince) errors.push("Other Province is required");
    // if (!otherMunicipality) errors.push("Other City/Municipality is required");
    // if (!otherBarangay) errors.push("Other Barangay is required");
    // if (!otherAddress) errors.push("Other House No./Street Name is required");
    if (!mobileNumber) errors.push("Mobile Number is required");
    // if (!emailAddress) errors.push("Email Address is required");

    // Newly added required fields validation
    if (!dateHire) errors.push("Date of Hire is required");
    if (!employeeType) errors.push("Employee Type is required");
    if (!payrollType) errors.push("Payroll Type is required");
    if (!salaryType) errors.push("Salary Type is required");
    if (!designation) errors.push("Designation is required");
    if (!departmentId) errors.push("Department is required");
    if (!immediateHeadId) errors.push("Immediate Head is required");
    // if (!tinId) errors.push("TIN ID # is required");
    // if (!philhealthId) errors.push("Philhealth ID # is required");
    // if (!sssId) errors.push("SSS ID # is required");
    // if (!pagibigId) errors.push("Pag-ibig ID # is required");

    // Father's Information validation
    // if (!fathersName) errors.push("Father's Name is required");
    // if (!fathersReligion) errors.push("Father's Religion is required");
    // if (!fathersAddress) errors.push("Father's Address is required");
    // if (!fathersMobileNumber) errors.push("Father's Mobile Number is required");

    // Mother's Information validation
    // if (!mothersName) errors.push("Mother's Name is required");
    // if (!mothersReligion) errors.push("Mother's Religion is required");
    // if (!mothersAddress) errors.push("Mother's Address is required");
    // if (!mothersMobileNumber) errors.push("Mother's Mobile Number is required");

    // Spouse Information validation (if married)
    // if (civilStatus === "MARRIED") {
    //   if (!spouseName)
    //     errors.push(
    //       `${gender === "MALE" ? "Wife's" : "Husband's"} Name is required`
    //     );
    //   if (!spouseReligion)
    //     errors.push(
    //       `${gender === "MALE" ? "Wife's" : "Husband's"} Religion is required`
    //     );
    //   if (!spouseAddress)
    //     errors.push(
    //       `${gender === "MALE" ? "Wife's" : "Husband's"} Address is required`
    //     );
    //   if (!spouseMobileNumber)
    //     errors.push(
    //       `${
    //         gender === "MALE" ? "Wife's" : "Husband's"
    //       } Mobile Number is required`
    //     );
    // }

    // Educational Attainment validation
    // if (!educationalAttainment)
    //   errors.push("Educational Attainment is required");
    // if (!schoolName) errors.push("School Name is required");
    // if (!course) errors.push("Course is required");
    // if (!level) errors.push("Level is required");
    // if (!year) errors.push("Year is required");

    // // Reference Information validation
    // if (!referenceName) errors.push("Reference Name is required");
    // if (!referenceAddress) errors.push("Reference Address is required");
    // if (!referenceMobileNumber)
    //   errors.push("Reference Mobile Number is required");

    // // Emergency Contact validation
    // if (!emergencyName) errors.push("Emergency Contact Name is required");
    // if (!emergencyAddress) errors.push("Emergency Contact Address is required");
    // if (!emergencyMobileNumber)
    //   errors.push("Emergency Contact Mobile Number is required");

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      setShowErrorMessage(true);
      return false;
    }
    setShowErrorMessage(false);
    setErrorMessage("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Perform client-side validation
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
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
      formDataToSend.append(
        "departmentId",
        formData.departmentId.id
          ? formData.departmentId.id
          : formData.departmentId
      );
      formDataToSend.append(
        "immediateHeadId",
        formData.immediateHeadId.employeeId
          ? formData.immediateHeadId.employeeId
          : formData.immediateHeadId
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

      if (formData.id) {
        // Update existing employee record
        await axios.put(
          `${apiUrl}/api/employeeRecord/${formData.id}`,
          formDataToSend
        );

        setSuccessMessage("Employee Record Updated Successfully!");
      } else {
        // Add new employee record
        await axios.post(`${apiUrl}/api/employeeRecord`, formDataToSend);

        setSuccessMessage("Employee Record Added Successfully!");
      }

      fetchData();
      clearFormData();
      setErrorMessage("");
      setShowSuccessMessage(true);
      handleCloseModal();

      setLoading(false);
    } catch (error) {
      // Handle any unexpected errors
      console.error("Error submitting form:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const renderCellWithWrapText = (params) => (
    <div className={"wrap-text"} style={{ textAlign: "center", width: "100%" }}>
      {params.value}
    </div>
  );

  const columns = [
    {
      field: "view",
      headerName: "View",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 50,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          variant="contained"
          disabled={loading}
          onClick={async () => {
            try {
              const id = params.row.id; // Get the document ID
              const employeeId = params.row.employeeId; // Get the document ID
              setLoadingRowId(id);

              const response = await axios.get(
                `${apiUrl}/api/employeeRecord/${employeeId}`
              );

              // Check for errors in the response
              if (response.data?.error) {
                throw new Error(response.data.error);
              }

              // Ensure the data structure is valid
              if (!response.data?.employeeRecord) {
                throw new Error("Invalid data received from the server.");
              }
              // Only call these functions if there are no errors
              if (response.data.employeeRecord) {
                console.log(response.data.employeeRecord);
                setSelectedRow(response.data.employeeRecord);
                setOpen(true);
              }
            } catch (error) {
              console.error("Error fetching document file:", error);
              alert(
                error.response?.data?.message ||
                  "An error occurred while fetching the transaction. Please try again."
              );
            } finally {
              setLoadingRowId(null); // Reset the loading row ID after the API call completes
            }
          }}
        >
          <PageviewIcon sx={{ fontSize: "2rem" }} />
        </IconButton>
      ),
    },
    {
      field: "employeeId",
      headerName: "Employee ID",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "employeeStatus",
      headerName: "Status",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 80,
      headerAlign: "center",
      valueGetter: (params) => {
        return `${params.row.firstName} ${params.row.affix || ""}` || "";
      },
      renderCell: renderCellWithWrapText,
    },
    {
      field: "middleName",
      headerName: "Middle Name",
      width: 90,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "husbandSurname",
      headerName: "Husband Surname",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "civilStatus",
      headerName: "Civil Status",
      width: 80,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "birthday",
      headerName: "Birthday",
      width: 125,
      headerAlign: "center",
      sortable: true,

      // Return raw Date for sorting
      sortComparator: (v1, v2) => {
        const date1 = new Date(v1);
        const date2 = new Date(v2);
        return date1 - date2;
      },

      // Value used for filtering
      valueGetter: (params) => {
        const date = new Date(params.row.birthday);
        if (isNaN(date)) return "";
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // e.g., "June 5, 2024"
      },

      // Cell rendering
      renderCell: (params) => {
        return renderCellWithWrapText({ value: params.value });
      },
    },
    {
      field: "dateHire",
      headerName: "Date Hire",
      width: 125,
      headerAlign: "center",
      sortable: true,

      // Return raw Date for sorting
      sortComparator: (v1, v2) => {
        const date1 = new Date(v1);
        const date2 = new Date(v2);
        return date1 - date2;
      },

      // Value used for filtering
      valueGetter: (params) => {
        const date = new Date(params.row.dateHire);
        if (isNaN(date)) return "";
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }); // e.g., "June 5, 2024"
      },

      // Cell rendering
      renderCell: (params) => {
        return renderCellWithWrapText({ value: params.value });
      },
    },
    {
      field: "employeeType",
      headerName: "Employee Type",
      minWidth: 80,
      flex: 1,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "designation",
      headerName: "Designation",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      renderCell: renderCellWithWrapText,
    },
    {
      field: "departmentId",
      headerName: "Department",
      width: 200,
      headerAlign: "center",
      valueGetter: (params) => {
        return params.row.Department?.department;
      },

      renderCell: renderCellWithWrapText,
    },
    {
      field: "mobileNumber",
      headerName: "Moblie Number",
      width: 150,
      headerAlign: "center",
      valueGetter: (params) =>
        params.row.mobileNumber
          ? params.row.mobileNumber.replace(/-/g, "")
          : "",
      renderCell: renderCellWithWrapText,
    },
  ];

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setSelectedTab(0);
  };

  const renderMuiNode = ({ nodeDatum }) => {
    return (
      <foreignObject width="200" height="100" x={-100} y={-50}>
        <Card
          variant="outlined"
          sx={{
            bgcolor: colors.grey[900],
            borderColor: colors.greenAccent[400],
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography variant="body1" fontWeight="bold" align="center">
              {`${nodeDatum.lastName}, ${nodeDatum.firstName} ${
                nodeDatum.affix
              } ${nodeDatum.middleName} ${
                nodeDatum.gender === "MALE"
                  ? ""
                  : nodeDatum.civilStatus === "SINGLE" ||
                    nodeDatum.civilStatus === "LIVE-IN"
                  ? ""
                  : ` - ${nodeDatum.husbandSurname}`
              }`}
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              {nodeDatum.designation}
            </Typography>
            <Typography
              variant="caption"
              align="center"
              display="block"
              color="text.secondary"
            >
              {nodeDatum.Department.department}
            </Typography>
          </CardContent>
        </Card>
      </foreignObject>
    );
  };

  const treeContainerRef = useRef();

  return (
    <Box p="20px" width="100% !important" position="relative">
      <LoadingSpinner isLoading={loading} />
      <Box display="flex" justifyContent="space-between">
        <Header
          title="Employee Records"
          subtitle="List of Employee for Future Reference"
        />
        {user.userType === 21 && (
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
      <Card>
        <Tabs
          value={selectedTabMain}
          onChange={handleChangeTabMain}
          sx={{
            "& .Mui-selected": {
              backgroundColor: colors.greenAccent[400],
              boxShadow: "none",
              borderBottom: `1px solid ${colors.grey[100]}`,
            },
            "& .MuiTab-root > span": {
              paddingRight: "10px",
            },
          }}
        >
          <Tab label={"Records"} />
          <Tab label={"Org Chart"} />
        </Tabs>
        {selectedTabMain === 0 && (
          <CustomDataGridStyles margin={0}>
            <DataGrid
              rows={employeeRecords ? employeeRecords : []}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
            />
          </CustomDataGridStyles>
        )}
        {selectedTabMain === 1 && (
          <Box height={"75vh"}>
            {/* <OrgChart
              datasource={orgData}
              chartClass="my-org-chart"
              NodeTemplate={MyNodeComponent}
            /> */}
            <div
              id="treeWrapper"
              ref={treeContainerRef}
              style={{
                width: "100%",
                height: "100vh",
                backgroundColor: colors.grey[100],
              }}
            >
              <Tree
                data={orgData}
                orientation="vertical"
                renderCustomNodeElement={renderMuiNode}
                translate={{ x: 400, y: 300 }}
                nodeSize={{ x: 220, y: 140 }} // Adjust these for spacing
                zoomable
                collapsible
                pathFunc="elbow"
              />
            </div>
          </Box>
        )}
      </Card>
      <EmployeeRecordModal
        user={user}
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        handleInputChange={handleInputChange}
        formData={formData}
        clearFormData={clearFormData}
        handleGenderChange={handleGenderChange}
        gender={gender}
        handleCivilStatusChange={handleCivilStatusChange}
        civilStatus={civilStatus}
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
      <EmployeeProfileModal
        user={user}
        selectedRow={selectedRow}
        open={open}
        openModal={openModal}
        handleClose={handleClose}
        handleEditClick={handleEditClick}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </Box>
  );
};

export default EmployeeRecords;
