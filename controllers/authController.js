import asyncHandlerMiddleware from "../middlewares/asyncHolderMiddleware.js";
import * as authServices from "../services/authServices.js"
import { signupSchema, loginSchema } from "../validators/authValidators.js";
import generateTokens from "../utils/generateToken.js";
import { Token } from "../models/index.js"

export const signupController = asyncHandlerMiddleware(async (req, res) => {
    const validatedSignupData = signupSchema.parse(req.body)
    const user = await authServices.signupService(validatedSignupData)

    const { accessToken, refreshToken } = await generateTokens({
        userId: user.id,
        username: user.username,
        email: user.email,
    })

    await Token.create({
        user_id: user.id,
        refresh_token: refreshToken
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,       // prevents JS access
        secure: true,         // send only over HTTPS
        sameSite: "strict",   // CSRF protection ---> Cross Site Request Forgery
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
    })
})

export const loginController = asyncHandlerMiddleware(async (req, res) => {
    const validatedLoginData = loginSchema.parse(req.body)

    const { user, accessToken, refreshToken } = await authServices.loginService(validatedLoginData)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,       // prevents JS access
        secure: true,         // send only over HTTPS
        sameSite: "strict",   // CSRF protection ---> Cross Site Request Forgery
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user,
    });
});

export const logoutController = asyncHandlerMiddleware(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401);
        throw new Error("Unauthorized. No user ID found.");
    };

    await authServices.logoutService(userId);

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});
