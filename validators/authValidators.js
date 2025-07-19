const { z } = require("zod");

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const passwordMessage =
    "Password must be at least 8 characters and include: 1 uppercase, 1 lowercase, 1 number, and 1 special character (!@#$%^&*()_+-=[]{}|;:',.<>/?)";

const signupSchema = z.object({
        first_name: z
            .string({ required_error: "First name is required" })
            .min(2, "First name must be at least 2 characters")
            .max(50, "First name must be under 50 characters"),

        last_name: z
            .string()
            .max(100, "Last name must be under 100 characters")
            .optional(),

        username: z
            .string({ required_error: "Username is required" })
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be under 30 characters"),

        email: z
            .string({ required_error: "Email is required" })
            .email("Must be a valid email"),

        password: z
            .string({ required_error: "Password is required" })
            .regex(passwordRegex, passwordMessage),

        confirm_password: z
            .string({ required_error: "Confirm password is required" }),
        otp: z
            .string({ required_error: "OTP is required" })
            .length(6, "OTP must be 6 digits"),

    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

const loginSchema = z.object({
    identifier: z
        .string({ required_error: "Username or email is required" })
        .min(3, "Must be at least 3 characters"),

    password: z
        .string({ required_error: "Password is required" })
        .regex(passwordRegex, passwordMessage),
});

const authValidators = {
    signupSchema,
    loginSchema,
};

module.exports = authValidators;
