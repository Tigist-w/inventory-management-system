const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, required: true, default: 0 },
    costPrice: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    images: [String],
    lowStockThreshold: { type: Number, default: 5 },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
