const express = require("express");
const serverless = require("serverless-http");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
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
// app.use(express.json()); // ✅ Must come first
app.use(bodyparser.json()); // Use body-parser to handle JSON bodies

// ✅ Fix Netlify string body issue
app.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString());
    } catch (err) {
      console.error("Failed to parse buffer body:", err.message);
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
