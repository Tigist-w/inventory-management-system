const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const {
  listCategories,
  createCategory,
} = require("../controllers/category.controller");

router.get("/", requireAuth, listCategories);
router.post("/", requireAuth, createCategory);

module.exports = router;
