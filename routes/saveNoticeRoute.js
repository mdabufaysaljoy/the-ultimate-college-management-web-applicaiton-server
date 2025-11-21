const router = require("express").Router();
const { ObjectId } = require("mongodb");

const SaveNotice = require("../schema/saveNoticeSchema");

//? middlewares
const verifyToken = require("../middlewares/verifyToken");
const saveNotice = require("../schema/saveNoticeSchema");

router.get("/find-by-email", verifyToken, async (req, res) => {
  const { email } = req.query;
  try {
    const findNotice = await SaveNotice.find({ email });
    //   console.log(findNotice,"- from line 13");
    res.send(findNotice);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { email } = req.query;
  const findNotice = await SaveNotice.findOne({ email, noticeId: id });
  // console.log(findNotice);
  if (findNotice) {
    res.send({ isSaved: true });
  } else {
    res.send({ isSaved: false });
  }
});
router.get("/saveCount/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await SaveNotice.find({ noticeId: id });
    res.status(200).send({ savedCount: response.length });
  } catch (error) {
    console.log(error.message);
  }
});
router.post("/", verifyToken, async (req, res) => {
  const saveNoticeData = req.body;
  try {
    const findNotice = await SaveNotice.findOne(saveNoticeData);
    if (!findNotice) {
      const saveNotice = new SaveNotice(saveNoticeData);
      const savingSaveNotice = await saveNotice.save();
      res.status(201).send(savingSaveNotice);
    } else {
      const response = await saveNotice.deleteOne(saveNoticeData);
      res.status(200).send(response);
    }
  } catch (error) {
    console.log(error.message);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
   try {
     const response = await SaveNotice.deleteOne({ noticeId: new ObjectId(id)});
     res.status(200).send(response);
   } catch (error) {
       console.log(error.message);
   }
});

module.exports = router;