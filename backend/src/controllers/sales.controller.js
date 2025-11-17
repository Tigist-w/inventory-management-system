const Sale = require("../models/Sale");
const Product = require("../models/Product");
const StockLog = require("../models/StockLog");

exports.createSale = async (req, res, next) => {
  try {
    const { items, tax = 0, paidAmount = 0 } = req.body;
    let total = 0;

    // reduce stock and compute total
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(404).json({ message: "Product not found" });
      p.quantity -= Number(it.qty);
      if (p.quantity < 0) p.quantity = 0;
      await p.save();
      await StockLog.create({
        product: p._id,
        type: "out",
        quantity: it.qty,
        note: "sale",
        user: req.user.id,
        source: "sale",
      });
      total += Number(it.qty) * Number(it.price);
    }

    const sale = await Sale.create({
      invoiceNumber: "INV-" + Date.now(),
      items,
      total,
      tax,
      paidAmount,
      createdBy: req.user.id,
    });

    res.json(sale);
  } catch (err) {
    next(err);
  }
};

exports.listSales = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate("createdBy")
      .sort({ createdAt: -1 });
    res.json(sales);
  } catch (err) {
    next(err);
  }
};
