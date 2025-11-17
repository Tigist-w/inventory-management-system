const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const { stockIn, stockOut, logs } = require("../controllers/stock.controller");

router.post("/in", requireAuth, stockIn);
router.post("/out", requireAuth, stockOut);
router.get("/logs", requireAuth, logs);

module.exports = router;
