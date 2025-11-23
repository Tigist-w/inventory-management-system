import Purchase from "../models/Purchase.js";

// Get all purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("product", "name")
      .populate("supplier", "name");
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single purchase
export const getPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("product", "name")
      .populate("supplier", "name");
    if (!purchase)
      return res.status(404).json({ message: "Purchase not found" });
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create purchase
export const createPurchase = async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    const populatedPurchase = await purchase
      .populate("product", "name")
      .populate("supplier", "name");
    res.status(201).json(populatedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update purchase
export const updatePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("product", "name")
      .populate("supplier", "name");

    if (!purchase)
      return res.status(404).json({ message: "Purchase not found" });
    res.json(purchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete purchase
export const deletePurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase)
      return res.status(404).json({ message: "Purchase not found" });
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
