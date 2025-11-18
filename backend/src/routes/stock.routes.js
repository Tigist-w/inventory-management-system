const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const { stockIn, stockOut, logs } = require("../controllers/stock.controller");
const logAction = require("../middlewares/logAction");

// stock in
router.post(
  "/in",
  requireAuth,
  logAction("stock_in", { takeBodySnapshot: true }),
  stockIn
);

// stock out
router.post(
  "/out",
  requireAuth,
  logAction("stock_out", { takeBodySnapshot: true }),
  stockOut
);
// get stock logs
router.get("/logs", requireAuth, logs);

module.exports = router;
