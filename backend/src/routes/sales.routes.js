const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const { createSale, listSales } = require("../controllers/sales.controller");
const logAction = require("../middlewares/logAction");

router.post(
  "/",
  requireAuth,
  logAction("create_sale", { takeBodySnapshot: true }),
  createSale
);
router.get("/", requireAuth, listSales);

module.exports = router;
