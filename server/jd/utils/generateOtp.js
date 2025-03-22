function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
  return otp.toString(); // Return OTP as a string
}

module.exports = generateOtp;
