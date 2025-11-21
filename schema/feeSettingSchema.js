const { model, Schema } = require("mongoose");

const feeSettingSchema = new Schema(
  {
    monthlyFee: {
      type: Number,
      required: true,
      default: 0,
    },
    examFeeMonths: {
      type: Map,
      of: Number,
      default: {},
    },
    otherFeeMonths: [
      {
        month: { type: String, required: true },
        fee: { type: Number, required: true },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

const FeeSettings = model("FeeSetting", feeSettingSchema);

module.exports = FeeSettings;
