const express = require("express");
const { signupController, loginController, logoutController } = require("../controllers/authController.js"); 
const validateZod = require("../middlewares/validateZod.js");
const { loginSchema, signupSchema } = require("../validators/authValidators.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

const authRouter = express.Router();

authRouter.post('/signup',validateZod(signupSchema), signupController)
authRouter.post('/login',validateZod(loginSchema), loginController)
authRouter.delete('/logout',authMiddleware, logoutController)

module.exports = authRouter;