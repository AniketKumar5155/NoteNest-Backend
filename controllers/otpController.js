const asyncHandlerMiddleware = require("../middlewares/asyncHolderMiddleware.js");
const { storeOtpInDb, sendOtpToEmail, verifyOtp } = require("../services/otpServices.js");
const generateOtp = require("../utils/generateOtp.js");

exports.getOtpController = asyncHandlerMiddleware(async (req, res) => {
  throw new Error(req.body);
  const { email } = req.body;

  if (!email) {
    throw new Error("Email is required to send OTP");
  }

  const { otp, expiresAt } = await generateOtp();

  // Pass both email/user_id to the store function as an object
  await storeOtpInDb(otp, email, expiresAt);

  // Use email if available, otherwise fetch user email before calling this
  await sendOtpToEmail(otp, email); // ⚠️ if email is undefined, this will break

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
