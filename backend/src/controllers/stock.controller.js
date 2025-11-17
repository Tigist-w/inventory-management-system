const StockLog = require("../models/StockLog");
const Product = require("../models/Product");

exports.stockIn = async (req, res, next) => {
  try {
    const { productId, quantity, note } = req.body;
    const p = await Product.findById(productId);
    if (!p) return res.status(404).json({ message: "Product not found" });
    p.quantity += Number(quantity);
    await p.save();
    await StockLog.create({
      product: p._id,
      type: "in",
      quantity,
      note,
      user: req.user.id,
      source: "manual",
    });
    res.json(p);
  } catch (err) {
    next(err);
  }
};

exports.stockOut = async (req, res, next) => {
  try {
    const { productId, quantity, note } = req.body;
    const p = await Product.findById(productId);
    if (!p) return res.status(404).json({ message: "Product not found" });
    p.quantity -= Number(quantity);
    if (p.quantity < 0) p.quantity = 0;
    await p.save();
    await StockLog.create({
      product: p._id,
      type: "out",
      quantity,
      note,
      user: req.user.id,
      source: "manual",
    });
    res.json(p);
  } catch (err) {
    next(err);
  }
};

exports.logs = async (req, res, next) => {
  try {
    const logs = await StockLog.find()
      .populate("product")
      .populate("user")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
