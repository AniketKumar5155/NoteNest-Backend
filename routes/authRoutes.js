import express from "express";
import { signupController, loginController, logoutController } from "../controllers/authController.js"; 
import validateZod from "../middlewares/validateZod.js";
import { loginSchema, signupSchema } from "../validators/authValidators.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

authRouter.post('/signup',validateZod(signupSchema), signupController)
authRouter.post('/login',validateZod(loginSchema), loginController)
authRouter.delete('/logout',authMiddleware, logoutController)

export default authRouter