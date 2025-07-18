import express from "express";
import { getOtpController, verifyOtpController  } from "../controllers/otpController.js";

const otpRouter = express.Router();

otpRouter.post('/get-otp', getOtpController)
otpRouter.post('/verify-otp', verifyOtpController)

export default otpRouter