const User = require("../schema/userSchema");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();
const { ObjectId } = require("mongodb");
const verifyAdmin = require("../middlewares/verifyAdmin");

//? get all user route
router.get("/", verifyToken, verifyAdmin, async (req, res, next) => {
  let { page, limit, sortByRole } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 5;
  const toSkip = (page - 1) * limit;
  let filter = {};
  if (sortByRole) {
    filter.role = sortByRole;
  }
  try {
    const allUsers = await User.find(filter).skip(toSkip).limit(limit);
    const totalDocs = await User.countDocuments(filter);
    const pageCount = Math.ceil(totalDocs / limit);
    // console.log(totalDocs)
    res.send({ allUsers, pageCount });
  } catch (error) {
    next(error);
  }
});
//? get all user route
router.get("/allStudents", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find({ role: "student" });
    res.send(allUsers);
  } catch (error) {
    next(error);
  }
});
//? check is admin route
router.get("/isAdmin/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  // console.log('email from params:', email, "decoded object:", req.decoded);
  if (email !== req.decoded?.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  try {
    const user = await User.findOne({ email });
    let admin = false;
    if (user) {
      admin = user?.role === "admin";
    }
    res.status(200).send({ admin });
  } catch (error) {
    console.log(error);
  }
});
//? create a user when login
router.post("/", async (req, res, next) => {
  const userData = req.body;
  try {
    const email = await User.findOne({ email: userData.email });
    // console.log(email);
    if (email) {
      return res.send({ success: true, message: "User Login successful" });
    }
    const result = await User.create(userData);
    res.status(201).send({ success: true, message: "User Created Successful" });
  } catch (error) {
    next(error);
  }
});
//? get username based on email
router.get("/get-username/:email", verifyToken, async (req, res) => {
  const { email } = req.params;
  try {
    const findUsername = await User.findOne({ email });
    if (findUsername?.username) {
      return res.send({ success: true, username: findUsername.username });
    }
    return res.send({ success: false, username: "" });
  } catch (error) {
    console.log(error);
  }
});
//? update a user based on email
router.patch("/update/:email", verifyToken, async (req, res) => {
  const { email } = req.params;
  const updatedDoc = req.body;
  console.log(updatedDoc, "from client body");
  try {
    const updtByEmail = await User.findOneAndUpdate({ email }, updatedDoc, {
      new: true,
    });
    console.log(updtByEmail);
    return res.send({
      success: true,
      data: updtByEmail,
      message: "User update successfully",
    });
  } catch (error) {
    console.log(error);
  }
  // res.send({ success: true, email });
});
// ? make someone admin route
router.patch("/makeAdmin/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  try {
    const chkAdmin = await User.findOne(filter);
    if (chkAdmin.role === "admin") {
      const updtToStudent = await User.updateOne(
        filter,
        { $set: { role: "student" } },
        { upsert: true }
      );
      return res.send(updtToStudent);
    }
    const updatedDoc = {
      $set: {
        role: "admin",
      },
    };
    const updtRes = await User.updateOne(filter, updatedDoc, { upsert: true });
    res.send(updtRes);
  } catch (error) {
    console.log("user update to admin error", error.message);
  }
});
//? delete a user route
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id;
  try {
    const dltRes = await User.deleteOne({ _id: new ObjectId(id) });
    res.send(dltRes);
  } catch (error) {
    console.log("dlt user error", error.message);
  }
});

module.exports = router;
