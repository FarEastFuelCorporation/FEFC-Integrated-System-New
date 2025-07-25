import moment from "moment-timezone";

export const timestampDate = (timestamp) => {
  return moment(timestamp).tz("Asia/Manila").format("YYYY-MM-DD HH:mm:ss");
};

export const parseTimeString = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

export const formatWeight = (weight) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(weight);
};

export const formatWeight2 = (weight) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  }).format(weight);
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatNumber = (weight) => {
  const roundedWeight = Math.round(weight * 100) / 100;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundedWeight);
};

export const formatNumber2 = (weight) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  }).format(weight);
};

export const formatWeightWithNA = (weight) => {
  if (weight === "N/A" || weight === 0) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  }).format(weight);
};

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const formatDate2 = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate(); // Get the day of the month
  const month = date.toLocaleString("en-US", { month: "short" }); // Get the abbreviated month
  const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year
  return `${day}-${month}-${year}`;
};

export function formatDate3(dateString) {
  const date = new Date(dateString);

  // Options for formatting the date
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Return the formatted date as "Month Day, Year"
  return date.toLocaleDateString("en-US", options);
}

export function formatDate4(isoString) {
  // Convert the ISO string to a Date object
  const date = new Date(isoString);

  // Define formatting options for month, day, and year
  const options = { year: "numeric", month: "long", day: "numeric" };

  // Format the date to 'October 16, 2024'
  return date.toLocaleDateString("en-US", options);
}

export const formatDateFull = (date) => {
  // Check if date is null, undefined, or invalid
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

// Function to format the time
export const formatTime = (dateString) => {
  const date = new Date(dateString); // Convert the string to a Date object
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Determine AM or PM suffix
  const ampm = hours >= 12 ? "PM" : "AM";
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Pad minutes and seconds with leading zeros
  const formattedTime = `${hours}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")} ${ampm}`;
  return formattedTime;
};

export function formatTime2(timeString) {
  const [hours, minutes] = timeString.split(":"); // Split time into hours and minutes
  const date = new Date();
  date.setHours(hours, minutes); // Set hours and minutes in the date object

  // Format the time to "h:mm AM/PM"
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleTimeString("en-US", options);
}

export function formatTime3(isoString) {
  // Create a new Date object from the ISO string
  const date = new Date(isoString);

  // Get the hours, minutes, and seconds
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour format to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // If hour is 0, make it 12

  // Return formatted time
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

export const formatTime4 = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
};

export const calculateRemainingDays = (expirationDate) => {
  if (expirationDate === null) {
    return null; // Handle invalid dates
  } else if (!expirationDate || isNaN(new Date(expirationDate).getTime())) {
    return "N/A"; // Handle invalid dates
  }

  const currentDate = new Date();
  const expiration = new Date(expirationDate);

  // Calculate the difference in time (milliseconds)
  const timeDiff = expiration.getTime() - currentDate.getTime();

  // Convert milliseconds to days
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return daysRemaining; // Return the remaining days (negative if expired)
};

export function calculateRemainingTime(expirationDate) {
  const now = new Date();
  const expiration = new Date(expirationDate);

  // Zero out the time part to compare dates only
  now.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  // Calculate the difference in time
  const differenceInTime = expiration - now; // in milliseconds

  // Calculate total days
  const totalDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  // Check if the date is expired
  const isExpired = totalDays < 0;

  // Use absolute value to calculate the year/month/day breakdown
  const absoluteDays = Math.abs(totalDays);

  const years = Math.floor(absoluteDays / 365); // Approximate years
  const months = Math.floor((absoluteDays % 365) / 30); // Approximate months
  const days = absoluteDays % 30; // Remaining days

  return { years, months, days, isExpired, totalDays };
}

export const getLatestTreatedDate = (transactions) => {
  return transactions.reduce((latest, waste) => {
    if (waste.TreatedWasteTransaction.length > 0) {
      const latestInWaste = waste.TreatedWasteTransaction.reduce(
        (latestDate, transaction) => {
          const treatedDate = new Date(transaction.treatedDate);
          return treatedDate > new Date(latestDate)
            ? treatedDate
            : new Date(latestDate);
        },
        new Date(0)
      );
      return latestInWaste > new Date(latest)
        ? latestInWaste
        : new Date(latest);
    }
    return new Date(latest);
  }, new Date(0));
};

export const formatDateWithSuffix = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Determine suffix
  const suffix = (day) => {
    if (day >= 11 && day <= 13) return "th"; // Special case for 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const suffixStr = suffix(day);

  // Return an object with day, suffix, and the rest of the date string
  return {
    day: day,
    suffix: suffixStr,
    dateString: `day of ${month} ${year}`,
  };
};

export function calculateAge(dateOfBirth) {
  // Ensure the input is a Date object
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // Adjust age if the current date is before the birth date this year
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

export function concatenatePresentAddress(selectedRow) {
  const { province, municipality, barangay, address } = selectedRow;

  // Initialize an array to hold non-null/undefined values
  const addressComponents = [];

  // Check each component and add to the array if valid
  if (address != null) addressComponents.push(address);
  if (barangay != null) addressComponents.push(`BRGY. ${barangay}`);
  if (municipality != null) addressComponents.push(municipality);
  if (province != null) addressComponents.push(province);

  // Return "NO Data" if no valid components were found
  if (addressComponents.length === 0) {
    return "No Data";
  }

  // Join the components with a comma and space
  return addressComponents.join(", ");
}

export function concatenatePermanentAddress(selectedRow) {
  const { otherProvince, otherMunicipality, otherBarangay, otherAddress } =
    selectedRow;

  // Initialize an array to hold non-null/undefined values
  const addressComponents = [];

  // Check each component and add to the array if valid
  if (otherAddress != null) addressComponents.push(otherAddress);
  if (otherBarangay != null) addressComponents.push(`BRGY. ${otherBarangay}`);
  if (otherMunicipality != null) addressComponents.push(otherMunicipality);
  if (otherProvince != null) addressComponents.push(otherProvince);

  // Return "NO Data" if no valid components were found
  if (addressComponents.length === 0) {
    return "No Data";
  }

  // Join the components with a comma and space
  return addressComponents.join(", ");
}

export function calculateLengthOfService(startDate) {
  // Convert the startDate to a Date object
  const start = new Date(startDate);
  const today = new Date();

  // Calculate the difference in years, months, and days
  let years = today.getFullYear() - start.getFullYear();
  let months = today.getMonth() - start.getMonth();
  let days = today.getDate() - start.getDate();

  // Adjust for negative days
  if (days < 0) {
    months--;
    const previousMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      0
    );
    days += previousMonth.getDate();
  }

  // Adjust for negative months
  if (months < 0) {
    years--;
    months += 12;
  }

  // Create an array to hold the parts of the result
  const resultParts = [];

  // Add years to the result if not zero
  if (years > 0) {
    resultParts.push(`${years} year${years > 1 ? "s" : ""}`);
  }

  // Add months to the result if not zero
  if (months > 0) {
    resultParts.push(`${months} month${months > 1 ? "s" : ""}`);
  }

  // Add days to the result if not zero
  if (days > 0) {
    resultParts.push(`${days} day${days > 1 ? "s" : ""}`);
  }

  // If no parts, return "No data"
  if (resultParts.length === 0) {
    return "No data";
  }

  // Join the parts with commas
  return resultParts.join(", ");
}

export const formatTimeRange = (inTime, outTime) => {
  if (!inTime || !outTime) return "Day Off";

  // Format start time (inTime)
  const [inHours, inMinutes, inSeconds] = inTime.split(":");
  const formattedInTime = new Date();
  formattedInTime.setHours(inHours);
  formattedInTime.setMinutes(inMinutes);
  formattedInTime.setSeconds(inSeconds);
  const formattedIn = formattedInTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  // Format end time (outTime)
  const [outHours, outMinutes, outSeconds] = outTime.split(":");
  const formattedOutTime = new Date();
  formattedOutTime.setHours(outHours);
  formattedOutTime.setMinutes(outMinutes);
  formattedOutTime.setSeconds(outSeconds);
  const formattedOut = formattedOutTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${formattedIn} - ${formattedOut}`;
};

export const generateWeeklyOptions = (year) => {
  return Array.from({ length: 53 }, (_, i) => {
    const weekNum = i + 1;
    const label = `Week ${weekNum} – ${getWeekDateRange(year, weekNum)}`;
    return { label, value: `Week ${weekNum}` };
  });
};

export const getWeekDateRange = (year, weekNumber) => {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dayOfWeek = simple.getDay(); // Sunday = 0, Monday = 1
  const isoDay = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Shift to Monday

  const startDate = new Date(simple);
  startDate.setDate(simple.getDate() + isoDay);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const format = (d) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return `${format(startDate)} – ${format(endDate)}`;
};

export const getFullSemiMonthlyCutoffs = (year) => {
  const cutoffs = [];
  let startDate = new Date(year - 1, 11, 26); // Dec 26 of previous year

  for (let i = 1; i <= 24; i++) {
    let endDate = new Date(startDate);
    if (i % 2 === 1) {
      // 1st cut-off of the month: 26–10
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(10);
    } else {
      // 2nd cut-off: 11–25
      endDate = new Date(startDate);
      endDate.setDate(25);
    }

    const format = (d) =>
      d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    cutoffs.push({
      label: `Cut-off ${i} – ${format(startDate)} to ${format(endDate)}`,
      value: `Cut-off ${i}`,
    });

    // Next start: day after current end
    startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() + 1);
  }

  return cutoffs;
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

export const calculate = (
  actualIn,
  actualOut,
  halfDay,
  withOT,
  paidBreak,
  statusFlags,
  scheduledIn,
  scheduledOut,
  salary,
  allowance
) => {
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

export const calculate2 = (
  actualIn,
  actualOut,
  halfDay,
  withOT,
  paidBreak,
  statusFlags,
  scheduledIn,
  scheduledOut,
  salary,
  allowance
) => {
  const key = getMultiplierKey(statusFlags);
  console.log(key);

  const rate = MULTIPLIERS[key];
  console.log(rate);

  const labelMap = {
    regular: "ORD",
    rdd: "RDD",
    sh: "SH",
    sh_rdd: "SHRDD",
    rh: "RH",
    rh_rdd: "RHRDD",
    dh: "DH",
    dh_rdd: "DHRDD",
  };

  const label = labelMap[key] || "ORD";

  const result = {};
  const labelSet = ["ORD", "RDD", "SH", "SHRDD", "RH", "RHRDD", "DH", "DHRDD"];

  labelSet.forEach((lbl) => {
    result[`${lbl}Day`] = { hours: 0.0, amount: 0.0 };
    result[`${lbl}Night`] = { hours: 0.0, amount: 0.0 };
    result[`${lbl}OTDay`] = { hours: 0.0, amount: 0.0 };
    result[`${lbl}OTNight`] = { hours: 0.0, amount: 0.0 };
  });

  const toMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  if (!actualIn || !actualOut || !scheduledIn || !scheduledOut || !salary) {
    return result;
  }

  let inMin = toMinutes(actualIn);
  let outMin = toMinutes(actualOut);
  let schedInMin = toMinutes(scheduledIn);
  let schedOutMin = toMinutes(scheduledOut);

  if (outMin < inMin) outMin += 1440;
  if (schedOutMin < schedInMin) schedOutMin += 1440;

  const NIGHT_START = 22 * 60;
  const NIGHT_END = 6 * 60;
  const perMinBase = salary / 8 / 60;

  const splitWork = (start, end, rateDay, rateNight) => {
    let day = 0,
      night = 0;
    for (let i = start; i < end; i++) {
      const min = i % 1440;
      if (min >= NIGHT_START || min < NIGHT_END) night++;
      else day++;
    }
    return {
      day,
      night,
      dayPay: day * perMinBase * rateDay,
      nightPay: night * perMinBase * rateNight,
    };
  };

  // REGULAR work
  const workStart = Math.max(inMin, schedInMin);
  const workEnd = Math.min(outMin, schedOutMin);

  let work = splitWork(workStart, workEnd, rate.day, rate.night);

  if (!paidBreak) {
    const totalWork = work.day + work.night;
    const deduct = Math.min(60, totalWork);
    if (work.night >= deduct) work.night -= deduct;
    else {
      deduct -= work.night;
      work.night = 0;
      work.day = Math.max(0, work.day - deduct);
    }
    work.dayPay = work.day * perMinBase * rate.day;
    work.nightPay = work.night * perMinBase * rate.night;
  }

  if (halfDay) {
    work.day = Math.floor(work.day / 2);
    work.night = Math.floor(work.night / 2);
    work.dayPay = work.day * perMinBase * rate.day;
    work.nightPay = work.night * perMinBase * rate.night;
  }

  result[`${label}Day`] = {
    hours: (work.day / 60).toFixed(2),
    amount: work.dayPay.toFixed(2),
  };
  result[`${label}Night`] = {
    hours: (work.night / 60).toFixed(2),
    amount: work.nightPay.toFixed(2),
  };

  // OVERTIME
  if (withOT && outMin > schedOutMin) {
    const ot = splitWork(schedOutMin, outMin, rate.otDay, rate.otNight);
    result[`${label}OTDay`] = {
      hours: (ot.day / 60).toFixed(2),
      amount: ot.dayPay.toFixed(2),
    };
    result[`${label}OTNight`] = {
      hours: (ot.night / 60).toFixed(2),
      amount: ot.nightPay.toFixed(2),
    };
  }

  console.log(result);

  return result;
};
