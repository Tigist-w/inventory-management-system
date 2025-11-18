const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const logAction = require("../middlewares/logAction");
const { Parser } = require("json2csv");

const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// ---------------------------
// List all products
// ---------------------------
router.get("/", requireAuth, listProducts);

// ---------------------------
// Export products as CSV
// Must be BEFORE /:id to avoid conflicts
// ---------------------------
router.get("/export", requireAuth, async (req, res) => {
  try {
    const products = await listProducts({});
    const parser = new Parser();
    const csv = parser.parse(products);

    res.header("Content-Type", "text/csv");
    res.attachment("products.csv");
    res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ message: "Failed to export products." });
  }
});

// ---------------------------
// Get single product
// ---------------------------
router.get("/:id", requireAuth, getProduct);

// ---------------------------
// Create product + images
// ---------------------------
router.post(
  "/",
  requireAuth,
  logAction("create_product", { takeBodySnapshot: true }),
  upload.array("images", 5),
  createProduct
);

// ---------------------------
// Update product + images
// ---------------------------
router.put(
  "/:id",
  requireAuth,
  logAction("update_product", { takeBodySnapshot: true }),
  upload.array("images", 5),
  updateProduct
);

// ---------------------------
// Delete product
// ---------------------------
router.delete("/:id", requireAuth, logAction("delete_product"), deleteProduct);

module.exports = router;
