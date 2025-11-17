const Category = require("../models/Category");

exports.listCategories = async (req, res, next) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    res.json(cat);
  } catch (err) {
    next(err);
  }
};
