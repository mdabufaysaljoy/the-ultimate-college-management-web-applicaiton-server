const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const cors = require('cors');
const jwt = require('jsonwebtoken')
const morgan = require("morgan");
const app = express();

//? routes imports
const noticeRoutes = require("./routes/noticeRoutes")
const userRoutes = require("./routes/userRoutes")

dotenv.config();

//? middlewares call
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(["http://localhost:5173"]))

// ? database connect

// mongodb+srv://<db_username>:<db_password>@users.wit5elw.mongodb.net/?retryWrites=true&w=majority&appName=users
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
app.post('/jwt', (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
  res.send({ token });
})

app.get('/', (req, res) => {
    res.send("Server is running...")
})



//? all users related apis
app.use('/users',userRoutes)

//? all notices related apis
app.use("/all-notices", noticeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})
