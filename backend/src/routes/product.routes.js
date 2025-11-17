const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/", requireAuth, listProducts);
router.get("/:id", requireAuth, getProduct);
router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

module.exports = router;
