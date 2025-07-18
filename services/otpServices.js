const bcrypt = require("bcryptjs");
const generateOtp = require("../utils/generateOtp.js");
const sendEmail = require("../utils/sendEmail.js");
const hashData = require("../utils/hashData.js");
const { Otp, User } = require("../models/index.js");

exports.sendOtpToEmail = async (otp, email) => {
  await sendEmail({
    to: email,
    subject: "Verify your Email",
    text: `Your OTP is: ${otp}`,
  });
};

exports.storeOtpInDb = async (otp, { email, user_id }, expiresAt) => {
  let finalEmail = email;

  // If user_id is provided but not email, fetch from user table
  if (!finalEmail && user_id) {
    const user = await User.findByPk(user_id);
    if (!user) throw new Error("User not found.");
    finalEmail = user.email;
  }

  if (!finalEmail) {
    throw new Error("Email is required for OTP storage.");
  }

  const hashedOtp = await hashData(otp);

  const cleanupWhere = user_id ? { user_id } : { email: finalEmail };
  await Otp.destroy({ where: cleanupWhere });

  // console.log("🔍 OTP insert payload:", {
  //   otp: hashedOtp,
  //   email: finalEmail,
  //   user_id: user_id || null,
  //   expires_at: expiresAt,
  // });

  await Otp.create({
    otp: hashedOtp,
    email: finalEmail,
    user_id: user_id || null,
    expires_at: expiresAt,
  });
};

exports.getOtpForSignup = async (email) => {
  try {
    if (!email || typeof email !== "string") {
      throw new Error("A valid email is required to send OTP.");
    }

    const { otp, expiresAt } = await generateOtp();

    await storeOtpInDb(otp, { email }, expiresAt);
    await sendOtpToEmail(otp, email);

    return {
      success: true,
      message: `OTP sent to ${email}`,
      // otp,
    };
  } catch (err) {
    console.error("Error in getOtpForSignup:", err.message);
    throw new Error("Failed to send OTP. Try again later.");
  }
};

exports.verifyOtp = async (otp, { email, user_id }) => {
  try {
    if (!otp || typeof otp !== "string") {
      throw new Error("A valid OTP is required.");
    }
    // console.log("after validating otp");

    const where = user_id ? { user_id } : email ? { email } : null;
    if (!where) {
      throw new Error("Either user_id or email is required.");
    }

    // console.log("fetching OTP using:", where);
    const otpEntry = await Otp.findOne({ where });

    if (!otpEntry) {
      throw new Error("No OTP found. Please request a new one.");
    }

    if (Date.now() > new Date(otpEntry.expires_at).getTime()) {
      await Otp.destroy({ where });
      throw new Error("OTP has expired. Please request a new one.");
    }

    const isMatch = await bcrypt.compare(otp, otpEntry.otp);
    if (!isMatch) {
      throw new Error("Invalid OTP. Please try again.");
    }

    await Otp.destroy({ where });

    return {
      success: true,
      message: "OTP verified successfully.",
    };
  } catch (err) {
    console.error("Error in verifyOtp:", err.message);
    throw new Error(err.message || "OTP verification failed.");
  }
};
