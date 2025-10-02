const User = require("../schema/userSchema");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();
const { ObjectId } = require("mongodb");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", verifyToken, verifyAdmin, async (req, res, next) => {
  let { page, limit,sortByRole } = req.query;
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
    res.send({allUsers,pageCount});
  } catch (error) {
    next(error);
  }
});
router.get("/isAdmin/:email", verifyToken, async (req, res) => {
  const email = req.params.email;
  // console.log('email from params:', email, "decoded object:", req.decoded);
  if (email !== req.decoded?.email) {
    return res.status(403).send({ message: "forbidden access" });
  }
  const user = await User.findOne({ email });
  let admin = false;
  if (user) {
    admin = user?.role === "admin";
  }
  res.send({ admin });
});
router.post("/", async (req, res, next) => {
  const userData = req.body;
  try {
    const email = await User.findOne({ email: userData.email });
    // console.log(email);
    if (email) {
      return res.send({ message: "user already exist" });
    }
    const result = await User.insertOne(userData);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
});

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
