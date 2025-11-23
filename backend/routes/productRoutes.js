import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Get all products
 */
router.get("/", async (req, res) => {
  try {
    const data = await getProducts(req, res);
    if (!data) return; // Controller already responded
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route POST /api/products
 * @desc Create product
 */
router.post("/", async (req, res) => {
  try {
    const data = await createProduct(req, res);
    if (!data) return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route PUT /api/products/:id
 * @desc Update product
 */
router.put("/:id", async (req, res) => {
  try {
    const data = await updateProduct(req, res);
    if (!data) return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 */
router.delete("/:id", async (req, res) => {
  try {
    const data = await deleteProduct(req, res);
    if (!data) return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
