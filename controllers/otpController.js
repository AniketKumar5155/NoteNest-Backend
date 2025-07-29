const asyncHandlerMiddleware = require("../middlewares/asyncHolderMiddleware.js");
const { storeOtpInDb, sendOtpToEmail, verifyOtp } = require("../services/otpServices.js");
const generateOtp = require("../utils/generateOtp.js");

exports.getOtpController = asyncHandlerMiddleware(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new Error("Email is required to send OTP");
  }

  const { otp, expiresAt } = await generateOtp();

  await storeOtpInDb(otp, email, expiresAt);

  await sendOtpToEmail(otp, email);

  res.status(200).json({
    success: true,
    message: `OTP sent successfully to ${email || "associated email"}`,
  });
});

exports.verifyOtpController = asyncHandlerMiddleware(async (req, res) => {
  const { otp, email } = req.body;

  if (!otp || (!email)) {
    throw new Error("OTP and email are required for verification");
  }

  const result = await verifyOtp(otp, email);

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});
