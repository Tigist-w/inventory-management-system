const Product = require("../models/Product");

// List Products with optional search, low stock filter, and pagination
exports.listProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, q = "", low } = req.query;

    // Build filter object
    let filter = {};
    if (q) filter.name = { $regex: q, $options: "i" }; // search by name
    if (low === "true") filter.quantity = { $lte: 5 }; // low stock

    const products = await Product.find(filter)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .populate("category")
      .lean();

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Get single product by ID
exports.getProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id).populate("category");
    res.json(p);
  } catch (err) {
    next(err);
  }
};

// Create product with optional images
exports.createProduct = async (req, res, next) => {
  try {
    const body = req.body;

    // Save uploaded files
    if (req.files) {
      body.images = req.files.map((file) => file.filename);
    }

    const prod = await Product.create(body);
    res.json(prod);
  } catch (err) {
    next(err);
  }
};

// Update product with optional images
exports.updateProduct = async (req, res, next) => {
  try {
    const body = req.body;

    // Update images if new files uploaded
    if (req.files && req.files.length > 0) {
      body.images = req.files.map((file) => file.filename);
    }

    const prod = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });
    res.json(prod);
  } catch (err) {
    next(err);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
