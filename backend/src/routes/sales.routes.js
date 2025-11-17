const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const { createSale, listSales } = require("../controllers/sales.controller");

router.post("/", requireAuth, createSale);
router.get("/", requireAuth, listSales);

module.exports = router;
