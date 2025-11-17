const Product = require("../models/Product");

exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("category").lean();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const p = await Product.findById(req.params.id).populate("category");
    res.json(p);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    const prod = await Product.create(body);
    res.json(prod);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const prod = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(prod);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
