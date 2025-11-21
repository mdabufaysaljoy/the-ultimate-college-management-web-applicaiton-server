const router = require("express").Router();

const { ObjectId } = require("mongodb");

const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyToken = require("../middlewares/verifyToken");
const Contact = require("../schema/contactSchema");

//? get contact Messages
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const response = await Contact.find();
    // console.log(response);
    return res.send({ success: true, response });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
});

//? post contact messages
router.post("/", async (req, res) => {
  const Doc = req.body;
  try {
    const querySaved = await Contact.create(Doc);
    querySaved.save();
    res.send({
      success: true,
      message: "Your query submitted. Thank You.",
    });
  } catch (error) {
    console.log(error);
  }
});

//? delete contact message
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await Contact.findByIdAndDelete(new ObjectId(id));
    console.log(response);
    return res.send({ success: true, response });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error });
  }
});

module.exports = router;
