import express from "express";
import Sale from "../models/Sale.js";
import Purchase from "../models/Purchase.js";
import Product from "../models/Product.js";

const router = express.Router();

// SUMMARY
router.get("/summary", async (req, res) => {
  try {
    const totalSalesAmount = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    const totalPurchaseAmount = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lte: 5 } });

    res.json({
      totalSales: totalSalesAmount[0]?.total || 0,
      totalPurchases: totalPurchaseAmount[0]?.total || 0,
      totalProducts,
      lowStock,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RECENT ACTIVITIES
router.get("/recent", async (req, res) => {
  try {
    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("product")
      .populate("customer");

    const recentPurchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("product")
      .populate("supplier");

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ recentSales, recentPurchases, recentProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CHART DATA (Monthly Sales vs Purchases)
router.get("/chart", async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const purchases = await Purchase.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json({ sales, purchases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
