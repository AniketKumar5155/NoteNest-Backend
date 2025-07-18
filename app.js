const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const notFoundMiddleware = require("./middlewares/notFoundMiddleware.js");
const errorHandlerMiddleware = require("./middlewares/errorHandlerMiddleware.js");
// const rateLimit = require("express-rate-limit");
const authRouter = require("./routes/authRoutes.js");
const otpRouter = require("./routes/otpRoutes.js");
const noteRouter = require("./routes/noteRoutes.js");

dotenv.config();
const app = express();

app.use(helmet());
app.use(morgan("dev"));
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.29.114:5173",
  "http://localhost:5174",
  "http://192.168.29.114:5174",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// app.use(rateLimit);

app.use("/auth", authRouter);
app.use("/otp", otpRouter);
app.use('/note', noteRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

app.listen(3000, '0.0.0.0', () => {
  console.log("Server running on http://<your-local-ip>:3000");
});

