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
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  generateWeeklyOptions,
  getFullSemiMonthlyCutoffs,
} from "../../../../../OtherComponents/Functions";
import { useEffect, useState } from "react";
import PayslipCopy from "./Payslip";
import axios from "axios";

const sampleData = {
  employeeName: "Juan Dela Cruz",
  position: "Warehouse Clerk",
  period: "June 1–15, 2025",
  basicPay: 8000,
  allowances: 1000,
  deductions: 500,
  netPay: 8500,
};

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

const PayslipModal = ({
  openModal,
  handleCloseModal,
  handleFormSubmit,
  formData,
  setFormData,
  showErrorMessage,
  errorMessage,
  colors,
  employees,
}) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [payslipData, setPayslipData] = useState([]);

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

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const period =
        formData.payrollType === "WEEKLY"
          ? formData.weekNumber
          : formData.cutOff;

      const response = await axios.get(`${apiUrl}/api/payroll/period`, {
        params: {
          year: formData.year,
          period: period,
          payrollType: formData.payrollType,
        },
      });

      console.log(response.data.payrolls);
      setPayslipData(response.data.payrolls);
    } catch (error) {
      console.error("Error fetching payslip:", error);
    } finally {
      setLoading(false);
    }
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
          {formData.id ? "Update Payslip" : "Generate Payslip"}
        </Typography>
        <Typography variant="h6" component="h2" color="error">
          {showErrorMessage && errorMessage}
        </Typography>
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
          <Grid
            item
            xs={8 / 3}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Generate"
              )}
            </Button>
          </Grid>
        </Grid>
        <Box>
          {payslipData.map((entry, index) => (
            <Box
              key={index}
              sx={{
                width: "816px", // 8.5in
                height: "1056px", // 11in
                p: 2,
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "@media print": {
                  pageBreakAfter: "always",
                },
              }}
            >
              <PayslipCopy data={entry} colors={colors} />
              <PayslipCopy data={entry} colors={colors} />
            </Box>
          ))}
        </Box>
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

export default PayslipModal;
