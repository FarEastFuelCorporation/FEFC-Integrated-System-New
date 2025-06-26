import { Box, Typography, Divider, Grid, TextField } from "@mui/material";
import {
  calculate,
  calculate2,
} from "../../../../../OtherComponents/Functions";

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

export default function PayslipCopy({ data, colors }) {
  const timeFields =
    data?.payrollType === "WEEKLY" ? timeFieldsWeekly : timeFieldsWeekly;

  // Step 1: Initialize total object
  const initTotals = () => {
    const keys = ["ORD", "RDD", "SH", "SHRDD", "RH", "RHRDD", "DH", "DHRDD"];
    const total = {};
    keys.forEach((key) => {
      ["Day", "Night", "OTDay", "OTNight"].forEach((suffix) => {
        total[`${key}${suffix}`] = { hours: 0, amount: 0 };
      });
    });
    return total;
  };

  // Step 2: Consolidate
  const consolidated = initTotals();

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  days.forEach((day) => {
    const flags = (data[day] || "")
      .split(",")
      .map((s) => s.trim().toUpperCase());
    const calc = calculate2(
      data[`${day}In`],
      data[`${day}Out`],
      data[`${day}HalfDay`] || false,
      data[`${day}WithOT`] || false,
      data.paidBreak,
      flags,
      data.scheduledIn,
      data.scheduledOut,
      parseFloat(data.salary),
      parseFloat(data.dayAllowance)
    );

    for (const key in calc) {
      if (consolidated[key]) {
        consolidated[key].hours += parseFloat(calc[key].hours);
        consolidated[key].amount += parseFloat(calc[key].amount);
      }
    }
  });

  // Step 3: Optionally format to fixed decimals
  Object.entries(consolidated).forEach(([key, value]) => {
    value.hours = value.hours.toFixed(2);
    value.amount = value.amount.toFixed(2);
  });
  console.log(consolidated);

  return (
    <Box
      sx={{
        border: "1px solid #000",
        p: 2,
        mb: 2,
        height: "528px", // Half of letter page
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container sx={{ mb: 1, height: "auto" }}>
        <Grid item xs={5}>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ width: 48, height: 48 }}>
              <img
                id="logo"
                src="/assets/logo.png"
                alt="FAR EAST FUEL CORPORATION Logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                ml: 1,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                FAR EAST FUEL CORPORATION
              </Typography>
              <Typography variant="body1">Employee Payslip</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                ml: 1,
              }}
            >
              <Typography variant="h6" fontWeight="bold" textAlign={"center"}>
                Employee ID: {data?.EmployeeRecord?.employeeId}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                ml: 1,
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                Name: {data?.EmployeeRecord?.lastName},{" "}
                {data?.EmployeeRecord?.firstName}{" "}
                {data?.EmployeeRecord?.affix
                  ? `${data.EmployeeRecord.affix} `
                  : ""}
                {data?.EmployeeRecord?.middleName || ""}{" "}
                {data?.EmployeeRecord?.husbandSurname
                  ? `- ${data.EmployeeRecord.husbandSurname}`
                  : ""}
              </Typography>
              <Typography variant="body1">
                Designation: {data?.EmployeeRecord?.designation}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 1 }} />
      <Box>
        <Grid container sx={{ mb: 1, height: "auto" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                border: "1px solid black",
                textAlign: "center",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                EARNINGS:
              </Typography>
            </Box>
          </Grid>
          <Grid container spacing={2}>
            {timeFields.map((day) => {
              return (
                <Grid item xs={12} sm={6} md={12 / 7} key={day}>
                  {(() => {
                    const flags = (data[day] || "")
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
                      data[`${day}In`],
                      data[`${day}Out`],
                      halfDay,
                      withOT,
                      data.paidBreak,
                      statusFlags,
                      data.scheduledIn,
                      data.scheduledOut,
                      parseFloat(data.salary),
                      parseFloat(data.dayAllowance)
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
                              sx={{
                                fontWeight: 500,
                                mb: 1,
                                textAlign: "center",
                              }}
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
                              sx={{
                                fontWeight: 500,
                                mb: 1,
                                textAlign: "center",
                              }}
                            >
                              {nightRate?.toFixed(3)}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 500,
                                mb: 1,
                                textAlign: "center",
                              }}
                            >
                              {dayHours}
                            </Typography>
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
        </Grid>
      </Box>
      <Box>
        <Typography variant="body2">Position: </Typography>
        <Typography variant="body2">Period: </Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="body2">Basic Pay: ₱</Typography>
        <Typography variant="body2">Allowances: ₱</Typography>
        <Typography variant="body2">Deductions: ₱</Typography>

        <Divider sx={{ my: 1 }} />

        <Typography variant="h6">Net Pay: ₱</Typography>
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="caption">
          Employee Signature: ____________
        </Typography>
        <Typography variant="caption">Date: ____________</Typography>
      </Box>
    </Box>
  );
}
