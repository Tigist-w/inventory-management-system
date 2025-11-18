const mongoose = require("mongoose");

const stockLogSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    type: { type: String, required: true }, // e.g., 'action', 'update', 'delete'
    note: { type: String, required: true }, // e.g., 'create_product'
    quantity: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    source: { type: String }, // optional: route source
    meta: { type: Object }, // optional: store method, body, IP, timestamp
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockLog", stockLogSchema);
