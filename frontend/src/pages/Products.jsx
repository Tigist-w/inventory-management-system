import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) API.defaults.headers.common["Authorization"] = "Bearer " + token;
    API.get("/products")
      .then((r) => setProducts(r.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} — qty: {p.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
