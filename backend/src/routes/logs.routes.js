const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const StockLog = require("../models/StockLog");

// get all logs (admin)
router.get("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const logs = await StockLog.find()
      .populate("user", "name email")
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .limit(500);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;
