const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const app = express();

//? routes imports
const noticeRoutes = require("./routes/noticeRoutes");
const userRoutes = require("./routes/userRoutes");
const saveNoticeRoutes = require("./routes/saveNoticeRoute");
const feeSettingsRoute = require("./routes/feeSettingsRoute");
const StudentPaymentRoute = require("./routes/studentPaymentRoute");
const contactRoutes = require("./routes/contactRoutes");
const { errorHandler, notFoundError } = require("./routes/errorHandlerRoute");

dotenv.config();

//? middlewares call
const middlewares = [
  express.json(),
  express.urlencoded({ extended: true }),
  morgan("dev"),
  cors(["http://localhost:5173"]),
];
app.use(middlewares);

// ? database connect
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@users.wit5elw.mongodb.net/CollegeDB`
  )
  .then(() => {
    console.log("database connected successfully");
  })
  .catch(() => {
    console.log("there is an error to connect with database");
  });

// ? jwt api
app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

app.get("/health", (_req, res) => {
  // throw new Error('something went wrong');
  res.status(200).send({ status: 200, message: "Server is running..." });
});

//? all users related apis
app.use("/users", userRoutes);

//? contacts api
app.use("/contact", contactRoutes);

//? all notices related apis
app.use("/notices", noticeRoutes);

//? save notice route
app.use("/saveNotice", saveNoticeRoutes);

//? set fee settings api
app.use("/fee-setting", feeSettingsRoute);

//? studentPayment api
app.use("/student-payment", StudentPaymentRoute);

//? error handler routes
app.use((_req, _res, next) => {
  const error = new Error("Resource Not Found");
  error.status = 404;
  next(error);
});
app.use((error, _req, res, _next) => {
  if (error.status) {
    return res
      .status(error.status)
      .send({ status: error.status, message: error.message });
  }
  res.status(500).send({ status: 500, message: error.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
