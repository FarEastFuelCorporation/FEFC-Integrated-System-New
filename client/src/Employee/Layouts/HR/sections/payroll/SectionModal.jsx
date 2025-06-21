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

const timeFields = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const statusOptions = [
  { label: "RDD", name: "restDayDuty" },
  { label: "RH", name: "regularHoliday" },
  { label: "SH", name: "specialHoliday" },
  { label: "DH", name: "doubleHoliday" },
  { label: "HD", name: "halfDay" },
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
  a: { day: 0.0, night: 0.0, otDay: 0.0, otNight: 0.0 },
  l: { day: 0.0, night: 0.0, otDay: 0.0, otNight: 0.0 },
};

const SectionModal = ({
  openModal,
  handleCloseModal,
  handleFormSubmit,
  formData,
  setFormData,
  refs,
  showErrorMessage,
  errorMessage,
  colors,
  employees,
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (day, option) => (e) => {
    setFormData((prev) => {
      const current = prev[day] || "";
      let values = current.split(",").filter(Boolean);

      const holidayGroup = ["RH", "SH", "DH"];
      const absenceGroup = ["A", "L", "PL"];

      const isChecked = e.target.checked;
      let updated = { ...prev };

      if (isChecked) {
        // Remove other options from the same group
        if (holidayGroup.includes(option)) {
          values = values.filter((val) => !holidayGroup.includes(val));
        } else if (absenceGroup.includes(option)) {
          values = values.filter((val) => !absenceGroup.includes(val));
        }

        // Add the current option if not already present
        if (!values.includes(option)) {
          values.push(option);
        }

        // If A is being checked, clear the in/out time
        if (option === "A" || option === "L" || option === "PL") {
          updated[`${day}In`] = "";
          updated[`${day}Out`] = "";
        }
      } else {
        // Remove if unchecked
        values = values.filter((val) => val !== option);
      }

      updated[day] = values.join(",");
      return updated;
    });
  };

  const getMultiplierKey = (flags) => {
    const { RDD, RH, SH, DH, A } = flags;

    if (A) {
      if (DH) return "dh_absent";
      if (RH) return "rh_absent";
      if (SH) return "sh_absent";
      return "a";
    }
    if (DH && RDD) return "dh_rdd";
    if (RH && RDD) return "rh_rdd";
    if (SH && RDD) return "sh_rdd";
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

    const rate = statusFlags;

    if (!actualIn || !actualOut || !scheduledIn || !scheduledOut || !salary) {
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
      work.dayPay = work.day * perMinBase * rate.day;
      work.nightPay = work.night * perMinBase * rate.night;
    }

    const grossPay =
      work.dayPay +
      work.nightPay +
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
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
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
                  designation: newValue.designation, // Set the employeeId
                }));
              }
            }}
            autoHighlight
          />
          <TextField
            label="Designation"
            name="designation"
            value={formData.designation || ""}
            fullWidth
            required
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
        </div>
        <div style={{ width: "100%", display: "flex", gap: "20px" }}>
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
            >
              <MenuItem value="CASH" sx={{ height: 50 }}>
                CASH
              </MenuItem>
              <MenuItem value="ATM" sx={{ height: 50 }}>
                ATM
              </MenuItem>
            </Select>
          </FormControl>
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
            >
              <MenuItem value="FIXED" sx={{ height: 50 }}>
                FIXED
              </MenuItem>
              <MenuItem value="TIME BASED" sx={{ height: 50 }}>
                TIME BASED
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Salary"
            name="salary"
            value={formData.salary || ""}
            onChange={handleInputChange}
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
          <TextField
            label="Day Allowance"
            name="dayAllowance"
            value={formData.dayAllowance || ""}
            onChange={handleInputChange}
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
          <TextField
            label="Night Allowance"
            name="nightAllowance"
            value={formData.nightAllowance || ""}
            onChange={handleInputChange}
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
        </div>

        <Grid container spacing={2}>
          {timeFields.map((day) => (
            <Grid item xs={12} sm={6} md={12 / 7} key={day}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 500, mb: 1, textAlign: "center" }}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Typography>
              <FormGroup row sx={{ justifyContent: "space-around", mb: 1 }}>
                {statusOptions.map(({ label, name }) => (
                  <Box
                    key={name}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mx: -1,
                    }}
                  >
                    <Typography variant="caption">{label}</Typography>
                    <Checkbox
                      size="small"
                      color="secondary"
                      checked={(formData[day] || "").split(",").includes(label)}
                      onChange={handleCheckboxChange(day, label)}
                    />
                  </Box>
                ))}
              </FormGroup>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2}>
          {timeFields.map((day) => (
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
          ))}
        </Grid>
        <Grid container spacing={2}>
          {timeFields.map((day) => (
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
                  A: flags.includes("A"),
                  L: flags.includes("L"),
                  PL: flags.includes("PL"),
                  HD: flags.includes("HD"),
                };
                const key = getMultiplierKey(statusFlags);
                const multiplier = MULTIPLIERS[key];
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
                  grossPay,
                } = calculate(
                  formData[`${day}In`],
                  formData[`${day}Out`],
                  halfDay,
                  withOT,
                  formData.paidBreak,
                  multiplier
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                          InputProps={{ readOnly: true }}
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
                      label="Gross Pay"
                      value={grossPay}
                      InputProps={{ readOnly: true }}
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
          ))}
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

export default SectionModal;
