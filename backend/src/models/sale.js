const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema(
  {
    invoiceNumber: String,
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        qty: Number,
        price: Number,
      },
    ],
    total: Number,
    tax: Number,
    paidAmount: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", SaleSchema);
