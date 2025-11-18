import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Read logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role; // <-- IMPORTANT

  // Fetch products with pagination + search
  const fetchProducts = async (pageNumber = 1, query = "") => {
    try {
      const res = await API.get(
        `/products?page=${pageNumber}&limit=10&q=${query}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Load first page on mount
  useEffect(() => {
    fetchProducts(1, "");
  }, []);

  // CSV download
  const downloadCSV = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/products/export", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products.csv";
        a.click();
      })
      .catch((err) => console.error("CSV download error:", err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      {/* Only admin can add products */}
      {userRole === "admin" && (
        <ProductForm
          onCreated={(newProduct) =>
            setProducts((prev) => [newProduct, ...prev])
          }
        />
      )}

      {/* Search + CSV */}
      <div style={{ marginTop: 20, marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 5, marginRight: 10 }}
        />
        <button onClick={() => fetchProducts(1, searchTerm)}>Search</button>

        {/* Only admin can export CSV */}
        {userRole === "admin" && (
          <button onClick={downloadCSV} style={{ marginLeft: 10 }}>
            Download CSV
          </button>
        )}
      </div>

      {/* Products List */}
      <ul>
        {products.map((p) => (
          <li
            key={p._id}
            style={{
              marginBottom: 15,
              color: p.quantity <= 5 ? "red" : "black",
            }}
          >
            <strong>{p.name}</strong> — qty: {p.quantity}
            <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
              {p.images?.map((img, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={p.name}
                  width={50}
                  style={{
                    border: "1px solid #ccc",
                    padding: 2,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            {/* Admin-only actions */}
            {userRole === "admin" && (
              <div style={{ marginTop: 5 }}>
                <button>Edit</button>
                <button style={{ marginLeft: 5, color: "red" }}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div style={{ marginTop: 10 }}>
        <button
          disabled={page === 1}
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
              fetchProducts(page - 1, searchTerm);
            }
          }}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>Page {page}</span>

        <button
          onClick={() => {
            setPage(page + 1);
            fetchProducts(page + 1, searchTerm);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
