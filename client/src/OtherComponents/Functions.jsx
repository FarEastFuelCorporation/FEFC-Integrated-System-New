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

export const formatNumber = (weight) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(weight);
};

export const formatWeightWithNA = (weight) => {
  if (weight === "N/A" || weight === 0) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(weight);
};

export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

export const formatDateFull = (date) => {
  // Check if date is null, undefined, or invalid
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
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

  // Calculate the difference in time
  const differenceInTime = expiration - now; // in milliseconds

  // Calculate total days
  const totalDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  // Check if the date is expired
  const isExpired = totalDays < 0;

  // If expired, calculate the absolute days
  const absoluteDays = Math.abs(totalDays);
  const years = Math.floor(absoluteDays / 365);
  const months = Math.floor((absoluteDays % 365) / 30);
  const days = absoluteDays % 30;

  return { years, months, days, isExpired, totalDays };
}
