const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");
const FeeSettings = require("../schema/feeSettingSchema");

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const feeSetting = req.body;
  try {
    const updated = await FeeSettings.findOneAndUpdate(
      {},
      { $set: feeSetting },
      { new: true, upsert: true }
    );
    console.log(feeSetting);
    return res.status(200).json({
      success: true,
      message: "Fee Settings Updated Successfully!",
      data: updated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const [response] = await FeeSettings.find();
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
