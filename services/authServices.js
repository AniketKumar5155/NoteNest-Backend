const { User, Token } = require("../models/index.js");
const { Op } = require("sequelize");
const hashData = require("../utils/hashData.js");
const verifyData = require("../utils/verifyData.js");
const generateTokens = require("../utils/generateToken.js");

const signupService = async ({ first_name, last_name, username, email, password }) => {
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hash_password = await hashData(password);

    const newUser = await User.create({
      first_name,
      last_name,
      username,
      email,
      password: hash_password,
    });

    return newUser;
  } catch (err) {
    console.error("SignupService Error:", err.message);
    throw new Error("Signup failed. Please try again." + err);
  }
};

const loginService = async ({ identifier, password }) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });
    if (!user) throw new Error("User not found");
    if (user.is_deleted) throw new Error("Account has been deleted");
    if (user.is_banned) throw new Error("Account is banned");
    if (user.is_active) throw new Error("Account is deactivated. Contact support to reactivate.");

    const isPasswordValid = await verifyData(password, user.password);
    if (!isPasswordValid) throw new Error("Incorrect password");

    const { accessToken, refreshToken } = await generateTokens({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    await Token.create({
      user_id: user.id,
      refresh_token: refreshToken,
    });
    
    return {
      success: true,
      message: "Login successful.",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  } catch (err) {
    console.error("LoginService Error:", err.message);
    throw new Error(`Login failed: ${err}`);
  }
};

const logoutService = async (userId) => {
  try {
    const tokenEntry = await Token.findOne({
      where: {
        user_id: userId
      },
    });

    if (!tokenEntry) {
      throw new Error("Refresh token not found.");
    }

    await tokenEntry.destroy();

    return {
      success: true,
      message: "Logout successful.",
    };
  } catch (err) {
    console.error("LogoutService Error:", err.message);
    throw new Error(`Logout failed: ${err}`);
  }
};

module.exports = {
  signupService,
  loginService,
  logoutService,
};
