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
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
