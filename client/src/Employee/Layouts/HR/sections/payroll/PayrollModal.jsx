import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  Autocomplete,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  generateWeeklyOptions,
  getFullSemiMonthlyCutoffs,
} from "../../../../../OtherComponents/Functions";
import { useEffect } from "react";

const timeFieldsWeekly = [
  "day1",
  "day2",
  "day3",
  "day4",
  "day5",
  "day6",
  "day7",
];
const timeFieldsSemiMonthly = [
  "day1",
  "day2",
  "day3",
  "day4",
  "day5",
  "day6",
  "day7",
  "day8",
  "day9",
  "day10",
  "day11",
  "day12",
  "day13",
  "day14",
  "day15",
  "day16",
];

const deductionOptions = [
  "SSS",
  "PAG-IBIG",
  "PHILHEALTH",
  "SSS LOAN",
  "PAG-IBIG LOAN",
  "CASH ADVANCE",
  "TAX",
  "OTHER",
];

const statusOptions = [
  { label: "RDD", name: "restDayDuty" },
  { label: "RH", name: "regularHoliday" },
  { label: "SH", name: "specialHoliday" },
  { label: "DH", name: "doubleHoliday" },
  { label: "HD", name: "halfDay" },
  { label: "RD", name: "restDay" },
  { label: "A", name: "absent" },
  { label: "L", name: "leave" },
  { label: "PL", name: "paidLeave" },
];

const MULTIPLIERS = {
  regular: {
    day: 1.0,
    night: 1.1,
    otDay: 1.25,
    otNight: 1.375,
  },
  rdd: {
    day: 1.3,
    night: 1.43,
    otDay: 1.69,
    otNight: 1.859,
  },
  sh: {
    day: 1.3,
    night: 1.43,
    otDay: 1.69,
    otNight: 1.859,
  },
  sh_rdd: {
    day: 1.5,
    night: 1.65,
    otDay: 1.95,
    otNight: 2.145,
  },
  rh: {
    day: 2.0,
    night: 2.2,
    otDay: 2.6,
    otNight: 2.86,
  },
  rh_rdd: {
    day: 2.6,
    night: 2.86,
    otDay: 3.38,
    otNight: 3.718,
  },
  dh: {
    day: 3.0,
    night: 3.3,
    otDay: 3.9,
    otNight: 4.29,
  },
  dh_rdd: {
    day: 3.3,
    night: 3.63,
    otDay: 4.29,
    otNight: 4.719,
  },
  rh_absent: {
    day: 1.0,
    night: 1.0,
    otDay: 0,
    otNight: 0,
  },
  sh_absent: {
    day: 0,
    night: 0,
    otDay: 0,
    otNight: 0,
  },
  dh_absent: {
    day: 2.0,
    night: 2.0,
    otDay: 0.0,
    otNight: 0.0,
  },
  pl: { day: 1.0, night: 1.1, otDay: 0.0, otNight: 0.0 },
  rd: { day: 0.0, night: 0.0, otDay: 0.0, otNight: 0.0 },
  a: { day: 0.0, night: 0.0, otDay: 0.0, otNight: 0.0 },
  l: { day: 0.0, night: 0.0, otDay: 0.0, otNight: 0.0 },
};

const PayrollModal = ({
  openModal,
  handleCloseModal,
  handleFormSubmit,
  formRef,
  formData,
  setFormData,
  showErrorMessage,
  errorMessage,
  colors,
  employees,
}) => {
  const timeFields =
    formData?.payrollType === "WEEKLY" ? timeFieldsWeekly : timeFieldsWeekly;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const updatedFormData = { ...formData };
    let hasChange = false;

    timeFields.forEach((day) => {
      const selectedValues = (formData[day] || "").split(",");
      const isAbsenceSelected = ["RD", "A", "L", "PL"].some((val) =>
        selectedValues.includes(val)
      );

      if (isAbsenceSelected) {
        if (formData[`${day}In`] || formData[`${day}Out`]) {
          updatedFormData[`${day}In`] = "";
          updatedFormData[`${day}Out`] = "";
          hasChange = true;
        }
      }
    });

    if (hasChange) {
      setFormData(updatedFormData);
    }
  }, [formData, timeFields]);

  useEffect(() => {
    let totalGross = 0;
    let totalDeductions = 0;
    let totalAdjustments = 0;

    // Calculate total gross from timeFields
    timeFields.forEach((day) => {
      const flags = (formData[day] || "")
        .split(",")
        .map((s) => s.trim().toUpperCase());

      const halfDay = flags.includes("HD");
      const withOT = flags.includes("OT");

      const statusFlags = {
        RDD: flags.includes("RDD"),
        RH: flags.includes("RH"),
        SH: flags.includes("SH"),
        DH: flags.includes("DH"),
        RD: flags.includes("RD"),
        A: flags.includes("A"),
        L: flags.includes("L"),
        PL: flags.includes("PL"),
        HD: flags.includes("HD"),
      };

      const result = calculate(
        formData[`${day}In`],
        formData[`${day}Out`],
        halfDay,
        withOT,
        formData.paidBreak,
        statusFlags
      );

      totalGross += parseFloat(result.grossPay || 0);
    });

    // Sum all deductionAmount values
    formData.deductions?.forEach((item) => {
      const amt = parseFloat(item.deductionAmount);
      if (!isNaN(amt)) {
        totalDeductions += amt;
      }
    });

    // Sum all adjustmentAmount values
    formData.adjustments?.forEach((item) => {
      const amt = parseFloat(item.adjustmentAmount);
      if (!isNaN(amt)) {
        totalAdjustments += amt;
      }
    });

    // Set both totals in formData
    setFormData((prev) => ({
      ...prev,
      totalGrossAmount: totalGross.toFixed(2),
      totalDeductionAmount: totalDeductions.toFixed(2),
      totalAdjustmentAmount: totalAdjustments.toFixed(2),
      netAmount: (totalGross - totalDeductions + totalAdjustments).toFixed(2),
    }));
  }, [
    formData.salary,
    formData.paidBreak,
    formData.deductions,
    formData.adjustments,
    ...timeFields.flatMap((day) => [
      formData[day],
      formData[`${day}In`],
      formData[`${day}Out`],
      formData[`${day}HalfDay`],
      formData[`${day}WithOT`],
    ]),
  ]);

  const handleAddDeduction = () => {
    setFormData((prev) => ({
      ...prev,
      deductions: [...prev.deductions, { deduction: "", deductionAmount: "" }],
    }));
  };

  const handleRemoveDeduction = (index) => {
    setFormData((prev) => {
      const updated = [...prev.deductions];
      updated.splice(index, 1);
      return {
        ...prev,
        deductions: updated,
      };
    });
  };

  const handleDeductionChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.deductions];
      updated[index][field] = value;
      return {
        ...prev,
        deductions: updated,
      };
    });
  };

  // Add new adjustment
  const handleAddAdjustment = () => {
    setFormData((prev) => ({
      ...prev,
      adjustments: [
        ...(prev.adjustments || []),
        { adjustment: "", adjustmentAmount: "" },
      ],
    }));
  };

  // Remove adjustment by index
  const handleRemoveAdjustment = (index) => {
    setFormData((prev) => {
      const updated = [...(prev.adjustments || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        adjustments: updated,
      };
    });
  };

  // Update specific adjustment field
  const handleAdjustmentChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...(prev.adjustments || [])];
      updated[index][field] = value;
      return {
        ...prev,
        adjustments: updated,
      };
    });
  };

  const handleCheckboxChange = (day, option) => (e) => {
    setFormData((prev) => {
      const current = prev[day] || "";
      let values = current.split(",").filter(Boolean);

      const holidayGroup = ["RH", "SH", "DH", "RDD"];
      const absenceGroup = ["RD", "A", "L", "PL"];

      const isChecked = e.target.checked;
      let updated = { ...prev };

      if (isChecked) {
        if (absenceGroup.includes(option)) {
          // Absence overrides all: replace with only the selected option
          values = [option];

          // Clear in/out time when absence is selected
          updated[`${day}In`] = "";
          updated[`${day}Out`] = "";
        } else {
          // Remove other holiday options from the group
          if (holidayGroup.includes(option)) {
            values = values.filter((val) => !holidayGroup.includes(val));
          }

          // Do not add if absence is already selected
          if (!absenceGroup.some((abs) => values.includes(abs))) {
            values.push(option);
          }
        }
      } else {
        // Remove unchecked option
        values = values.filter((val) => val !== option);
      }

      updated[day] = values.join(",");
      return updated;
    });
  };

  const getMultiplierKey = (flags) => {
    const { RD, RDD, RH, SH, DH, A } = flags;

    if (A) {
      if (DH) return "dh_absent";
      if (RH) return "rh_absent";
      if (SH) return "sh_absent";
      return "a";
    }
    if (DH && RDD) return "dh_rdd";
    if (RH && RDD) return "rh_rdd";
    if (SH && RDD) return "sh_rdd";
    if (RD) return "rd";
    if (DH) return "dh";
    if (RH) return "rh";
    if (SH) return "sh";
    if (RDD) return "rdd";
    return "regular";
  };

  const calculate = (
    actualIn,
    actualOut,
    halfDay,
    withOT,
    paidBreak,
    statusFlags
  ) => {
    const scheduledIn = formData.scheduledIn;
    const scheduledOut = formData.scheduledOut;
    const salary = parseFloat(formData.salary);
    const allowance = parseFloat(formData.dayAllowance);

    const key = getMultiplierKey(statusFlags);
    const multiplier = MULTIPLIERS[key];

    const rate = multiplier;

    if (statusFlags.RD || statusFlags.PL || statusFlags.L || statusFlags.A) {
      const grossPay = salary.toFixed(2);
      return {
        dayRate: 0,
        nightRate: 0,
        otDayRate: 0,
        otNightRate: 0,
        hours: "",
        dayHours: "",
        nightHours: "",
        lateMins: "",
        dayLateMins: "",
        nightLateMins: "",
        latePay: "",
        dayLatePay: "",
        nightLatePay: "",
        undertimeMins: "",
        dayUndertimeMins: "",
        nightUndertimeMins: "",
        undertimePay: "",
        dayUndertimePay: "",
        nightUndertimePay: "",
        overtimeHours: "",
        dayOvertimeHours: "",
        nightOvertimeHours: "",
        overtimePay: "",
        dayOvertimePay: "",
        nightOvertimePay: "",
        allowance: "",
        grossPay: statusFlags.PL ? grossPay : "",
      };
    } else if (
      !actualIn ||
      !actualOut ||
      !scheduledIn ||
      !scheduledOut ||
      !salary
    ) {
      return {
        dayRate: rate.day,
        nightRate: rate.night,
        otDayRate: rate.otDay,
        otNightRate: rate.otNight,
        hours: "",
        dayHours: "",
        nightHours: "",
        lateMins: "",
        dayLateMins: "",
        nightLateMins: "",
        latePay: "",
        dayLatePay: "",
        nightLatePay: "",
        undertimeMins: "",
        dayUndertimeMins: "",
        nightUndertimeMins: "",
        undertimePay: "",
        dayUndertimePay: "",
        nightUndertimePay: "",
        overtimeHours: "",
        dayOvertimeHours: "",
        nightOvertimeHours: "",
        overtimePay: "",
        dayOvertimePay: "",
        nightOvertimePay: "",
        allowance: "",
        grossPay: "",
      };
    }

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    let inMin = toMinutes(actualIn);
    let outMin = toMinutes(actualOut);
    let schedInMin = toMinutes(scheduledIn);
    let schedOutMin = toMinutes(scheduledOut);

    if (outMin < inMin) outMin += 24 * 60;
    if (schedOutMin < schedInMin) schedOutMin += 24 * 60;

    const NIGHT_START = 22 * 60;
    const NIGHT_END = 6 * 60;

    const perMinBase = salary / 8 / 60;

    // Split utility
    const splitWithRate = (start, end) => {
      let day = 0;
      let night = 0;
      for (let i = start; i < end; i++) {
        const min = i % (24 * 60);
        if (min >= NIGHT_START || min < NIGHT_END) night++;
        else day++;
      }
      return {
        day,
        night,
        allowance,
        dayPay: day * perMinBase * rate.day,
        nightPay: night * perMinBase * rate.night,
      };
    };

    const work = splitWithRate(
      Math.max(inMin, schedInMin),
      Math.min(outMin, schedOutMin)
    );

    // Deduct 1 hour (60 minutes) if break is unpaid
    if (!paidBreak) {
      const totalWorkMins = work.day + work.night;
      const breakDeduct = Math.min(60, totalWorkMins); // avoid going negative
      if (work.night >= breakDeduct) {
        work.night -= breakDeduct;
      } else {
        const remaining = breakDeduct - work.night;
        work.night = 0;
        work.day = Math.max(0, work.day - remaining);
      }

      // Recalculate pay after deduction
      work.dayPay = work.day * perMinBase * rate.day;
      work.nightPay = work.night * perMinBase * rate.night;
    }

    const late = splitWithRate(schedInMin, inMin);
    const undertime = splitWithRate(outMin, schedOutMin);
    const overtime = withOT
      ? splitWithRate(schedOutMin, outMin)
      : { day: 0, night: 0, dayPay: 0, nightPay: 0 };

    if (halfDay) {
      work.day = Math.floor(work.day / 2);
      work.night = Math.floor(work.night / 2);
      work.allowance = Math.floor(work.allowance / 2);
      work.dayPay = work.day * perMinBase * rate.day;
      work.nightPay = work.night * perMinBase * rate.night;
    }

    const grossPay =
      work.dayPay +
      work.nightPay +
      work.allowance +
      overtime.dayPay +
      overtime.nightPay -
      late.dayPay -
      late.nightPay -
      undertime.dayPay -
      undertime.nightPay;

    return {
      hours: "8.00",
      dayRate: rate.day,
      nightRate: rate.night,
      otDayRate: rate.otDay,
      otNightRate: rate.otNight,

      dayHours: (work.day / 60).toFixed(2),
      nightHours: (work.night / 60).toFixed(2),

      lateMins: (late.day + late.night).toString(),
      dayLateMins: late.day.toString(),
      nightLateMins: late.night.toString(),
      latePay: (late.dayPay + late.nightPay).toFixed(2),
      dayLatePay: late.dayPay.toFixed(2),
      nightLatePay: late.nightPay.toFixed(2),

      undertimeMins: (undertime.day + undertime.night).toString(),
      dayUndertimeMins: undertime.day.toString(),
      nightUndertimeMins: undertime.night.toString(),
      undertimePay: (undertime.dayPay + undertime.nightPay).toFixed(2),
      dayUndertimePay: undertime.dayPay.toFixed(2),
      nightUndertimePay: undertime.nightPay.toFixed(2),

      overtimeHours: ((overtime.day + overtime.night) / 60).toFixed(2),
      dayOvertimeHours: (overtime.day / 60).toFixed(2),
      nightOvertimeHours: (overtime.night / 60).toFixed(2),
      overtimePay: (overtime.dayPay + overtime.nightPay).toFixed(2),
      dayOvertimePay: overtime.dayPay.toFixed(2),
      nightOvertimePay: overtime.nightPay.toFixed(2),

      allowance: allowance.toFixed(2),
      grossPay: grossPay.toFixed(2),
    };
  };

  return (
    <Modal open={openModal} onClose={handleCloseModal}>
      <Box
        component="form"
        onSubmit={handleFormSubmit}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 1800,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          {formData.id ? "Update Payroll" : "Add Payroll"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Autocomplete
              options={employees || []} // Subordinates array for autocomplete
              getOptionLabel={(option) =>
                `${option.lastName}, ${option.firstName} ${option.affix || ""}`
              } // Display full name
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Full Name"
                  name="employeeId"
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                  autoComplete="off"
                />
              )}
              value={
                employees.find(
                  (option) => option.employeeId === formData.employeeId
                ) || null
              } // Set the value to the current employee
              onChange={(event, newValue) => {
                // Handle selection and set the employeeId as the value
                if (newValue) {
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    employeeId: newValue.employeeId, // Set the employeeId
                    designation: newValue.designation,
                    payrollType: newValue.EmployeeSalary?.[0]?.payrollType,
                    salaryType: newValue.EmployeeSalary?.[0]?.salaryType,
                    compensationType:
                      newValue.EmployeeSalary?.[0]?.compensationType,
                    salary: newValue.EmployeeSalary?.[0]?.salary || 0,
                    dayAllowance:
                      newValue.EmployeeSalary?.[0]?.dayAllowance || 0,
                  }));
                }
              }}
              autoHighlight
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Designation"
              name="designation"
              value={formData.designation || ""}
              fullWidth
              required
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                readOnly: true,
              }}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={4 / 3}>
            {/* Year Field (common to both WEEKLY and SEMI-MONTHLY) */}
            <FormControl fullWidth required>
              <InputLabel
                id="year-label"
                style={{
                  color: colors.grey[100],
                }}
              >
                Year
              </InputLabel>
              <Select
                labelId="year-label"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                label="Year"
              >
                <MenuItem value={new Date().getFullYear()} sx={{ height: 50 }}>
                  {new Date().getFullYear()}
                </MenuItem>
                <MenuItem
                  value={new Date().getFullYear() - 1}
                  sx={{ height: 50 }}
                >
                  {new Date().getFullYear() - 1}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8 / 3}>
            {/* Week Number Autocomplete for WEEKLY */}
            {formData.payrollType === "WEEKLY" && formData.year && (
              <Autocomplete
                options={generateWeeklyOptions(Number(formData.year))}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Week Number"
                    name="weekNumber"
                    required
                    autoComplete="off"
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        color: colors.grey[100],
                      },
                    }}
                  />
                )}
                value={
                  generateWeeklyOptions(Number(formData.year)).find(
                    (opt) => opt.value === formData.weekNumber
                  ) || null
                }
                onChange={(event, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    weekNumber: newValue?.value || "",
                  }))
                }
              />
            )}

            {/* Cut-off Autocomplete for SEMI-MONTHLY */}
            {formData.payrollType === "SEMI-MONTHLY" && formData.year && (
              <Autocomplete
                options={getFullSemiMonthlyCutoffs(
                  Number(formData.year),
                  new Date().getMonth()
                )}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cut-Off"
                    name="cutOff"
                    required
                    InputLabelProps={{
                      shrink: true,
                      style: {
                        color: colors.grey[100],
                      },
                    }}
                  />
                )}
                value={
                  getFullSemiMonthlyCutoffs(
                    Number(formData.year),
                    new Date().getMonth()
                  ).find((opt) => opt.value === formData.cutOff) || null
                }
                onChange={(event, newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    cutOff: newValue?.value || "",
                  }))
                }
              />
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12 / 9}>
            <FormControl fullWidth required>
              <InputLabel
                id="payrollType-label"
                style={{
                  color: colors.grey[100],
                }}
              >
                Payroll Type
              </InputLabel>
              <Select
                labelId="payrollType-label"
                name="payrollType"
                value={formData.payrollType}
                onChange={handleInputChange}
                label="Payroll Type"
                disabled
              >
                <MenuItem value="SEMI-MONTHLY" sx={{ height: 50 }}>
                  SEMI-MONTHLY
                </MenuItem>
                <MenuItem value="WEEKLY" sx={{ height: 50 }}>
                  WEEKLY
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12 / 9}>
            <FormControl fullWidth required>
              <InputLabel
                id="salaryType-label"
                style={{
                  color: colors.grey[100],
                }}
              >
                Salary Type
              </InputLabel>
              <Select
                labelId="salaryType-label"
                name="salaryType"
                value={formData.salaryType}
                onChange={handleInputChange}
                label="Salary Type"
                disabled
              >
                <MenuItem value="CASH" sx={{ height: 50 }}>
                  CASH
                </MenuItem>
                <MenuItem value="ATM" sx={{ height: 50 }}>
                  ATM
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12 / 9}>
            <FormControl fullWidth required>
              <InputLabel
                id="compensationType-label"
                style={{
                  color: colors.grey[100],
                }}
              >
                Compensation Type
              </InputLabel>
              <Select
                labelId="compensationType-label"
                name="compensationType"
                value={formData.compensationType}
                onChange={handleInputChange}
                label="Compensation Type"
                disabled
              >
                <MenuItem value="FIXED" sx={{ height: 50 }}>
                  FIXED
                </MenuItem>
                <MenuItem value="TIME BASED" sx={{ height: 50 }}>
                  TIME BASED
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12 / 9}>
            <TextField
              label="Salary"
              name="salary"
              value={formData.salary || 0}
              onChange={handleInputChange}
              fullWidth
              required
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12 / 9}>
            <TextField
              label="Day Allowance"
              name="dayAllowance"
              value={formData.dayAllowance || 0}
              onChange={handleInputChange}
              fullWidth
              required
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              autoComplete="off"
            />
          </Grid>
          <Grid item xs={12 / 9}>
            <TextField
              fullWidth
              label="In"
              name="scheduledIn"
              type="time"
              value={formData.scheduledIn || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                sx: {
                  "& input::-webkit-calendar-picker-indicator": {
                    display: "none",
                    WebkitAppearance: "none",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12 / 9}>
            <TextField
              fullWidth
              label="Out"
              name="scheduledOut"
              type="time"
              value={formData.scheduledOut || ""}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                sx: {
                  "& input::-webkit-calendar-picker-indicator": {
                    display: "none",
                    WebkitAppearance: "none",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12 / 9}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  color="secondary"
                  checked={formData.paidBreak || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paidBreak: e.target.checked,
                    }))
                  }
                />
              }
              label="Paid Break"
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            overflowX: timeFields.length > 7 ? "auto" : "visible",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width:
                timeFields.length > 7
                  ? `${(100 / 7) * timeFields.length}%`
                  : "100%",
              minWidth: timeFields.length > 7 ? "max-content" : "auto",
            }}
          >
            {timeFields.map((day) => (
              <Box
                key={day}
                sx={{
                  width: "14.28%", // 100 / 7
                  minWidth: "150px",
                  px: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 500, mb: 1, textAlign: "center" }}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Typography>
                <FormGroup row sx={{ justifyContent: "space-around", mb: 1 }}>
                  {statusOptions.map(({ label, name }) => {
                    const selectedValues = (formData[day] || "").split(",");
                    const isAbsenceSelected = ["RD", "A", "L", "PL"].some(
                      (abs) => selectedValues.includes(abs)
                    );
                    const isHoliday = ["RDD", "RH", "SH", "DH", "HD"].includes(
                      label
                    );
                    const isDisabled = isAbsenceSelected && isHoliday;

                    return (
                      <Box
                        key={name}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          mx: -1.5,
                          opacity: isDisabled ? 0.4 : 1,
                          pointerEvents: isDisabled ? "none" : "auto", // visually and functionally disable
                        }}
                      >
                        <Typography variant="caption">{label}</Typography>
                        <Checkbox
                          size="small"
                          color="secondary"
                          checked={selectedValues.includes(label)}
                          onChange={handleCheckboxChange(day, label)}
                          disabled={isDisabled}
                        />
                      </Box>
                    );
                  })}
                </FormGroup>
              </Box>
            ))}
          </Box>
        </Box>

        <Grid container spacing={2}>
          {timeFields.map((day) => {
            const selectedValues = (formData[day] || "").split(",");
            const isAbsenceSelected = ["RD", "A", "L", "PL"].some((val) =>
              selectedValues.includes(val)
            );

            return (
              <Grid item xs={12} sm={6} md={12 / 7} key={day}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="In"
                      name={`${day}In`}
                      type="time"
                      value={formData[`${day}In`] || ""}
                      onChange={handleInputChange}
                      disabled={isAbsenceSelected}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                      size="small"
                      InputProps={{
                        sx: {
                          "& input::-webkit-calendar-picker-indicator": {
                            display: "none",
                            WebkitAppearance: "none",
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Out"
                      name={`${day}Out`}
                      type="time"
                      value={formData[`${day}Out`] || ""}
                      onChange={handleInputChange}
                      disabled={isAbsenceSelected}
                      InputLabelProps={{
                        shrink: true,
                        style: {
                          color: colors.grey[100],
                        },
                      }}
                      size="small"
                      InputProps={{
                        sx: {
                          "& input::-webkit-calendar-picker-indicator": {
                            display: "none",
                            WebkitAppearance: "none",
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
        <Grid container spacing={2}>
          {timeFields.map((day) => {
            return (
              <Grid item xs={12} sm={6} md={12 / 7} key={day}>
                {(() => {
                  const flags = (formData[day] || "")
                    .split(",")
                    .map((s) => s.trim().toUpperCase());
                  const halfDay = flags.includes("HD");
                  const withOT = flags.includes("OT");
                  const statusFlags = {
                    RDD: flags.includes("RDD"),
                    RH: flags.includes("RH"),
                    SH: flags.includes("SH"),
                    DH: flags.includes("DH"),
                    RD: flags.includes("RD"),
                    A: flags.includes("A"),
                    L: flags.includes("L"),
                    PL: flags.includes("PL"),
                    HD: flags.includes("HD"),
                  };
                  const {
                    dayRate,
                    nightRate,
                    otDayRate,
                    otNightRate,
                    dayHours,
                    nightHours,
                    dayLateMins,
                    nightLateMins,
                    dayLatePay,
                    nightLatePay,
                    dayUndertimeMins,
                    nightUndertimeMins,
                    dayUndertimePay,
                    nightUndertimePay,
                    dayOvertimeHours,
                    nightOvertimeHours,
                    dayOvertimePay,
                    nightOvertimePay,
                    allowance,
                    grossPay,
                  } = calculate(
                    formData[`${day}In`],
                    formData[`${day}Out`],
                    halfDay,
                    withOT,
                    formData.paidBreak,
                    statusFlags
                  );

                  return (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, textAlign: "center" }}
                          >
                            Day Rate
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, mb: 1, textAlign: "center" }}
                          >
                            {dayRate?.toFixed(3)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, textAlign: "center" }}
                          >
                            Night Rate
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, mb: 1, textAlign: "center" }}
                          >
                            {nightRate?.toFixed(3)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Hours"
                            value={dayHours}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Hours"
                            value={nightHours}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Late (mins)"
                            value={dayLateMins}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Late (mins)"
                            value={nightLateMins}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Late Pay"
                            value={dayLatePay}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Late Pay"
                            value={nightLatePay}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Undertime (mins)"
                            value={dayUndertimeMins}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Undertime (mins)"
                            value={nightUndertimeMins}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Undertime Pay"
                            value={dayUndertimePay}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Undertime Pay"
                            value={nightUndertimePay}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                      </Grid>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              color="secondary"
                              checked={(formData[day] || "")
                                .split(",")
                                .includes("OT")}
                              onChange={handleCheckboxChange(day, "OT")}
                            />
                          }
                          label="With OT"
                          labelPlacement="end"
                        />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, textAlign: "center" }}
                          >
                            OT Day Rate
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, textAlign: "center" }}
                          >
                            {otDayRate?.toFixed(3)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, textAlign: "center" }}
                          >
                            OT Night Rate
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500, textAlign: "center" }}
                          >
                            {otNightRate?.toFixed(3)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Overtime Hours"
                            value={dayOvertimeHours}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Overtime Hours"
                            value={nightOvertimeHours}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Overtime Pay"
                            value={dayOvertimePay}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Overtime Pay"
                            value={nightOvertimePay}
                            disabled
                            InputProps={{
                              sx: {
                                textAlign: "right",
                                "& input": {
                                  textAlign: "right",
                                },
                              },
                            }}
                            InputLabelProps={{
                              shrink: true,
                              style: {
                                color: colors.grey[100],
                              },
                            }}
                            size="small"
                            sx={{ mt: 1 }}
                            color="secondary"
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        fullWidth
                        label="Allowance"
                        value={allowance}
                        disabled
                        InputProps={{
                          sx: {
                            textAlign: "right",
                            "& input": {
                              textAlign: "right",
                            },
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            color: colors.grey[100],
                          },
                        }}
                        size="small"
                        sx={{ mt: 1 }}
                        color="secondary"
                      />
                      <TextField
                        fullWidth
                        label="Gross Pay"
                        value={grossPay}
                        disabled
                        InputProps={{
                          sx: {
                            textAlign: "right",
                            "& input": {
                              textAlign: "right",
                            },
                          },
                        }}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            color: colors.grey[100],
                          },
                        }}
                        size="small"
                        sx={{ mt: 1 }}
                        color="secondary"
                      />
                    </>
                  );
                })()}
              </Grid>
            );
          })}
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12 / 7}>
            <TextField
              label="Total Gross Amount"
              name="totalGrossAmount"
              value={formData.totalGrossAmount || ""}
              size="small"
              onChange={handleInputChange}
              fullWidth
              required
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  "& input": {
                    textAlign: "right",
                  },
                },
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Deductions
          </Typography>
          {(formData.deductions || []).map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Grid item xs={4}>
                <TextField
                  select
                  fullWidth
                  label="Deduction"
                  value={item.deduction}
                  size="small"
                  onChange={(e) =>
                    handleDeductionChange(index, "deduction", e.target.value)
                  }
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                >
                  {deductionOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Conditionally show extra input for OTHER */}
              {item.deduction === "OTHER" && (
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Specify Deduction"
                    name="otherDeduction"
                    defaultValue={formRef.current.otherDeduction}
                    size="small"
                    InputLabelProps={{
                      style: {
                        color: colors.grey[100],
                      },
                    }}
                  />
                </Grid>
              )}

              <Grid item xs={item.deduction === "OTHER" ? 3 : 3}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={item.deductionAmount}
                  size="small"
                  onChange={(e) =>
                    handleDeductionChange(
                      index,
                      "deductionAmount",
                      e.target.value
                    )
                  }
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Grid>

              <Grid item xs={1}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveDeduction(index)}
                    size="small"
                    sx={{
                      minWidth: 36,
                      width: 36,
                      height: 36,
                      padding: 0,
                      borderRadius: "50%",
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12 / 7}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddDeduction}
              size="small"
              sx={{
                minWidth: 36,
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: "50%",
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Grid>
          <Grid item xs={12 / 7}>
            <TextField
              label="Total Deduction Amount"
              name="totalDeductionAmount"
              value={formData.totalDeductionAmount || ""}
              size="small"
              onChange={handleInputChange}
              fullWidth
              required
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  "& input": {
                    textAlign: "right",
                  },
                },
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Adjustments
          </Typography>
          {(formData.adjustments || []).map((item, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Adjustment"
                  name="adjustment"
                  defaultValue={formRef.current.adjustment}
                  size="small"
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={item.adjustmentAmount}
                  size="small"
                  onChange={(e) =>
                    handleAdjustmentChange(
                      index,
                      "adjustmentAmount",
                      e.target.value
                    )
                  }
                  InputLabelProps={{
                    style: {
                      color: colors.grey[100],
                    },
                  }}
                />
              </Grid>

              <Grid item xs={1}>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveAdjustment(index)}
                    size="small"
                    sx={{
                      minWidth: 36,
                      width: 36,
                      height: 36,
                      padding: 0,
                      borderRadius: "50%",
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                </Box>
              </Grid>
            </Grid>
          ))}
        </Box>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item xs={12 / 7}>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddAdjustment}
              size="small"
              sx={{
                minWidth: 36,
                width: 36,
                height: 36,
                padding: 0,
                borderRadius: "50%",
              }}
            >
              <AddIcon fontSize="small" />
            </Button>
          </Grid>
          <Grid item xs={12 / 7}>
            <TextField
              label="Total Adjustment Amount"
              name="totalAdjustmentAmount"
              value={formData.totalAdjustmentAmount || ""}
              size="small"
              onChange={handleInputChange}
              fullWidth
              required
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  "& input": {
                    textAlign: "right",
                  },
                },
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end">
          <Grid item xs={12 / 7}>
            <TextField
              label="Net Amount"
              name="netAmount"
              value={formData.netAmount || ""}
              size="small"
              onChange={handleInputChange}
              fullWidth
              required
              disabled
              InputLabelProps={{
                shrink: true,
                style: {
                  color: colors.grey[100],
                },
              }}
              InputProps={{
                sx: {
                  textAlign: "right",
                  "& input": {
                    textAlign: "right",
                  },
                },
              }}
              autoComplete="off"
            />
          </Grid>
        </Grid>
        <TextField
          label="Created By"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleInputChange}
          fullWidth
          autoComplete="off"
          style={{ display: "none" }}
        />
        <Button variant="contained" color="primary" onClick={handleFormSubmit}>
          {formData.id ? "Update" : "Add"}
        </Button>
      </Box>
    </Modal>
  );
};

export default PayrollModal;
