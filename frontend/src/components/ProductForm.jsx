import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function ProductForm({ onCreated }) {
  // Product form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  // Fetch categories from backend on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("category", categoryId);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      const token = localStorage.getItem("token");
      API.defaults.headers.common["Authorization"] = "Bearer " + token;

      const res = await API.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully");
      onCreated && onCreated(res.data);

      // Reset form
      setName("");
      setPrice("");
      setQuantity("");
      setImages([]);
      setCategoryId("");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Error creating product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 400,
      }}
    >
      <input
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        type="file"
        multiple
        name="images"
        onChange={(e) => setImages(e.target.files)}
      />
      <button type="submit">Create Product</button>
    </form>
  );
}
