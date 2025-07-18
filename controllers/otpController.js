import asyncHandlerMiddleware from "../Middlewares/asyncHolderMiddleware.js";
import { storeOtpInDb, sendOtpToEmail, verifyOtp } from "../services/otpServices.js";
import generateOtp from "../utils/generateOtp.js";

export const getOtpController = asyncHandlerMiddleware(async (req, res) => {
  const { email, user_id } = req.body;

  if (!email && !user_id) {
    throw new Error("Either email or user_id is required to send OTP");
  }

  const { otp, expiresAt } = await generateOtp();

  // Pass both email/user_id to the store function as an object
  await storeOtpInDb(otp, { email, user_id }, expiresAt);

  // Use email if available, otherwise fetch user email before calling this
  await sendOtpToEmail(otp, email); // ⚠️ if email is undefined, this will break

  res.status(200).json({
    success: true,
    message: `OTP sent successfully to ${email || "associated email"}`,
  });
});

export const verifyOtpController = asyncHandlerMiddleware(async (req, res) => {
  const { otp, email, user_id } = req.body;

  if (!otp || (!email && !user_id)) {
    throw new Error("OTP and either email or user_id are required for verification");
  }

  const result = await verifyOtp(otp, { email, user_id });

  return res.status(200).json({
    success: true,
    message: result.message,
  });
});
