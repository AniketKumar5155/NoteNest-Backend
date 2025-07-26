const jwt = require("jsonwebtoken");
const { User } = require("../models/index.js");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Access Token:", token);

    const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN);
    const user = await User.findByPk(decoded.userId);

    if (!user || user.is_deleted || user.is_banned) {
      return res.status(403).json({ message: "Access denied. Invalid user." });
    }
    console.log("TOKEN RECEIVED:", req.headers.authorization);


    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
