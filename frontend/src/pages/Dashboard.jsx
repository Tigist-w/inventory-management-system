import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import API from "../services/api";

export default function Dashboard() {
  const [salesSummary, setSalesSummary] = useState([]);

  // Fetch sales summary from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) API.defaults.headers.common["Authorization"] = "Bearer " + token;

    API.get("/reports/sales-summary")
      .then((res) => {
        // Reshape data for LineChart
        // Example: [{ name: "Sales", totalSales: 123 }]
        const data = [
          { name: "Total Sales", totalSales: res.data.totalSales || 0 },
        ];
        setSalesSummary(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      {/* Navigation */}
      <nav style={{ marginBottom: 20 }}>
        <Link to="/products">Products</Link>
      </nav>

      {/* Sales Summary Chart */}
      <h3>Sales Summary</h3>
      {salesSummary.length > 0 ? (
        <LineChart width={500} height={300} data={salesSummary}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
        </LineChart>
      ) : (
        <p>Loading sales summary...</p>
      )}
    </div>
  );
}
