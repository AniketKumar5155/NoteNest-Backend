const express = require("express");
const { getOtpController, verifyOtpController } = require("../controllers/otpController.js");

const otpRouter = express.Router();

otpRouter.post('/get-otp', getOtpController);
otpRouter.post('/verify-otp', verifyOtpController);

module.exports = otpRouter;