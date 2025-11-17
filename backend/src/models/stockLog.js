const mongoose = require("mongoose");

const StockLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: { type: String, enum: ["in", "out", "adjustment"], required: true },
    quantity: { type: Number, required: true },
    note: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    source: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockLog", StockLogSchema);
