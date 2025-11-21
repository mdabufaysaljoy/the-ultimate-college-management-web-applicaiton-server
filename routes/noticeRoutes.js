const router = require("express").Router();
const { ObjectId } = require("mongodb");

const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");

const Notice = require("../schema/noticeSchema");

router.get("/load-all-notices", verifyToken, async (req, res) => {
  try {
    const allNotices = await Notice.find();
    // console.log(allNotices,"- from line 10 notice route")
    res.status(200).send(allNotices);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res, next) => {
  let { page, limit, importanceType } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const toSkip = (page - 1) * limit;
  let filter = {};
  if (importanceType) {
    filter.importanceType = importanceType;
  }
  try {
    const allNotices = await Notice.find(filter).skip(toSkip).limit(limit);
    const docCount = await Notice.countDocuments(filter);
    const pageCount = Math.ceil(docCount / limit);
    res.status(200).send({ allNotices, pageCount });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/admin-posted-notice",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    const { email } = req.query;
    try {
      const adminPostedNotice = await Notice.find({ email });
      //  console.log(adminPostedNotice);
      res.status(200).send(adminPostedNotice);
    } catch (error) {
      console.log(error.message);
    }
  }
);

router.post("/", verifyToken, verifyAdmin, async (req, res, next) => {
  const noticeData = req.body;
  try {
    const newNotice = new Notice(noticeData);
    const saveNotice = await newNotice.save();
    res.status(201).send(saveNotice);
  } catch (error) {
    next(error);
  }
});

router.patch("/edit-notice/:id", async (req, res) => {
  const { id } = req.params;
  const changedData = req.body;
  // console.log(changedData)
  try {
   await Notice.findByIdAndUpdate(new ObjectId(id), changedData);
    res.status(200).send({ message: "Notice Updated Successfully!" });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-notice/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Notice.deleteOne({ _id: new ObjectId(id) });
    //  console.log(result);
    res.status(200).send(result);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
