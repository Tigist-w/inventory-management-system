import express from "express";
import {
  getSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
} from "../controllers/salesController.js";

const router = express.Router();

router.get("/", getSales); // GET all sales
router.get("/:id", getSaleById); // GET sale by ID
router.post("/", createSale); // CREATE sale
router.put("/:id", updateSale); // UPDATE sale
router.delete("/:id", deleteSale); // DELETE sale

export default router;
