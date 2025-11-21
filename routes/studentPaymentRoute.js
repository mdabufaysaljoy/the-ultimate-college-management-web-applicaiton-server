const router = require("express").Router();
const axios = require("axios");
const SSLCommerz = require("sslcommerz-lts");
const verifyToken = require("../middlewares/verifyToken");
const StudentPayment = require("../schema/studentPaymentSchema");
const verifyAdmin = require("../middlewares/verifyAdmin");
require("dotenv").config();
//? Store information
const store_id = process.env.SSLCZ_STORE_ID;
const store_key = process.env.SSLCZ_STORE_PASS;
const is_live = false;
//? payment initialize route
router.post("/init", verifyToken, async (req, res) => {
  const { amountPaid, email, phone, month } = req.body;
  //   console.log(store_id);
  // console.log(req.path)
  const trans_id = `TXN_${Date.now()}`;
  const data = {
    total_amount: amountPaid,
    currency: "BDT",
    tran_id: trans_id,
    success_url: `${process.env.SERVER_URL}/student-payment/success?tran_id=${trans_id}`,
    fail_url: `${process.env.SERVER_URL}/student-payment/fail?tran_id=${trans_id}`,
    cancel_url: `${process.env.SERVER_URL}/student-payment/cancel`,
    emi_option: 0,
    cus_email: email,
    cus_phone: phone,
    product_name: "Student Monthly Fee",
    product_category: "Education",
    product_profile: "non-physical-goods",
    shipping_method: "NO",
    value_a: email,
    value_b: month,
    value_c: amountPaid,
  };
  const sslcz = new SSLCommerz(store_id, store_key, is_live);
  // console.log(sslcz)
  const sslRes = await sslcz.init(data);
  //   console.log(sslRes);
  if (sslRes.status === "SUCCESS") {
    res.send({ success: true, url: sslRes.GatewayPageURL });
  } else {
    res.send({ success: false, message: "couldn't reach sslcz server" });
  }
});
//? payment validation route
router.post("/success", async (req, res) => {
  const { tran_id, value_a, value_b, value_c, val_id } = req.body;

  try {
    const validationURL = `${process.env.SSLCZ_VAl_API}?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_key}&v=1&format=json`;

    const sslRes = await axios.get(validationURL);
    // console.log(sslRes.data);
    if (sslRes.statusText === "OK") {
      if (sslRes.data.status === "VALID") {
        const {
          value_a: cus_email,
          value_b: paidMonth,
          amount,
          store_amount,
          card_issuer: paymentProvider,
          tran_id,
          tran_date,
        } = sslRes.data;
        const doc = {
          email: cus_email,
          month: paidMonth,
          amountPaid: parseInt(amount),
          storeAmount: store_amount,
          paidWith: paymentProvider,
          paymentStatus: "paid",
          transectionId: tran_id,
          paymentDate: tran_date,
        };
        const newPayment = new StudentPayment(doc);

        await newPayment.save();
        return res.redirect(
          `${process.env.CLIENT_URL}/payment-success?transectionId=${tran_id}`
        );
      } else {
        return res.redirect(
          `${process.env.CLIENT_URL}/payment-failed?reason=validation_failed`
        );
      }
    } else {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-failed?reason=validation_failed`
      );
    }
  } catch (error) {
    console.log("error on payment validation", error);
    return res.redirect(
      `${process.env.CLIENT_URL}/payment-failed?reason=server_error`
    );
  }
});
//? payment fail route
router.post("/fail", (req, res) => {
  const data = req.body;
  if (data.status === "FAILED") {
    return res.redirect(
      `${process.env.CLIENT_URL}/payment-failed?reason=Wrong%20Credentials`
    );
  }
});
//? find payment by transectionId
router.get(
  "/find-by-transectionId/:transectionId",
  verifyToken,
  async (req, res) => {
    const { transectionId } = req.params;
    try {
      const findRes = await StudentPayment.findOne({ transectionId });
      console.log(findRes);
      return res.status(200).send(findRes);
    } catch (error) {
      console.log(error);
    }
  }
);
//? find payment by email
router.get("/find-by-email/:email", verifyToken, async (req, res) => {
  const { email } = req.params;
  try {
    const findRes = await StudentPayment.find({ email });
    // console.log(findRes);
    return res.status(200).send(findRes);
  } catch (error) {
    console.log(error);
  }
});
//? find all payments
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  const response = await StudentPayment.find();
  res.send(response);
});
module.exports = router;
