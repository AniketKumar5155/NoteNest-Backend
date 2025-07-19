const express = require("express");
const serverless = require("serverless-http");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const notFoundMiddleware = require("../../middlewares/notFoundMiddleware.js");
const errorHandlerMiddleware = require("../../middlewares/errorHandlerMiddleware.js");

const authRouter = require("../../routes/authRoutes.js");
const otpRouter = require("../../routes/otpRoutes.js");
const noteRouter = require("../../routes/noteRoutes.js");

dotenv.config();
const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // ✅ Must come first

// ✅ Fix Netlify string body issue
app.use((req, res, next) => {
  if (req.body && typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch (err) {
      console.error("JSON parsing failed:", err.message);
    }
  }
  next();
});

app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/otp", otpRouter);
app.use("/note", noteRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports.handler = serverless(app);
