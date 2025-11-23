import React, { useState, useEffect, useCallback } from "react";
import API from "../services/api";

const ProductModal = ({ isOpen, onClose, onSave, product }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  const fetchCategories = useCallback(async () => {
    try {
      const res = await API.get("/categories"); // Make sure endpoint is correct
      setCategories(res.data);

      // If adding new product, preselect first category
      if (!product && res.data.length > 0) setCategory(res.data[0].name);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  }, [product]);

  // Populate form when modal opens or product changes
  useEffect(() => {
    if (isOpen) fetchCategories();

    if (product) {
      setName(product.name || "");
      setCategory(product.category || "");
      setPrice(product.price || "");
      setStock(product.stock || "");
    } else {
      setName("");
      setCategory("");
      setPrice("");
      setStock("");
    }
  }, [isOpen, product, fetchCategories]);

  // Save product
  const handleSave = async () => {
    if (!name || !category || !price || !stock) {
      alert("Please fill all required fields!");
      return;
    }

    const data = { name, category, price, stock };

    try {
      if (product) {
        await API.put(`/products/${product._id}`, data);
      } else {
        await API.post("/products", data);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Save product error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            {categories.length === 0 && (
              <option value="">No categories found</option>
            )}
            {categories.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
