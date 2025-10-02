const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");
const Notice = require("../schema/noticeSchema");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  let { page, limit,importanceType } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);
  const toSkip = (page - 1) * limit;
  let filter = {}
  if (importanceType) {
    filter.importanceType = importanceType
}
  try {
    const allNotices = await Notice.find(filter).skip(toSkip).limit(limit);
    const docCount = await Notice.countDocuments(filter);
    const pageCount = Math.ceil(docCount / limit);
    res.status(200).send({allNotices,pageCount});
  } catch (error) {
    next(error);
  }
});
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

module.exports = router;
