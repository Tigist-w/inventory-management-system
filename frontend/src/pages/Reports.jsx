import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stock, setStock] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const resSales = await axios.get("/api/sales");
        const resPurchases = await axios.get("/api/purchases");
        const resStock = await axios.get("/api/products");
        setSales(resSales.data);
        setPurchases(resPurchases.data);
        setStock(resStock.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchReports();
  }, []);

  // Filter by date
  const filterByDate = (items) => {
    return items.filter((item) => {
      const date = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) return date >= start && date <= end;
      if (start) return date >= start;
      if (end) return date <= end;
      return true;
    });
  };

  const salesData = {
    labels: filterByDate(sales).map((s) =>
      new Date(s.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Sales Amount",
        data: filterByDate(sales).map((s) => s.quantity * s.price),
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
      },
    ],
  };

  const purchasesData = {
    labels: filterByDate(purchases).map((p) =>
      new Date(p.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Purchases Amount",
        data: filterByDate(purchases).map((p) => p.quantity * p.price),
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
      },
    ],
  };

  const lowStock = stock.filter((p) => p.stock <= 5);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Reports</h1>

      {/* Date Filters */}
      <div className="flex gap-4 items-center mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-md px-3 py-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-md px-3 py-2"
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sales Chart</h2>
        <Line data={salesData} />
        <CSVLink
          data={filterByDate(sales)}
          filename={"sales_report.csv"}
          className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Purchases Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Purchases Chart</h2>
        <Line data={purchasesData} />
        <CSVLink
          data={filterByDate(purchases)}
          filename={"purchases_report.csv"}
          className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Export CSV
        </CSVLink>
      </div>

      {/* Low Stock */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-red-600">
          Low Stock Alerts
        </h2>
        {lowStock.length === 0 ? (
          <p className="text-gray-500">No products with low stock</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStock.map((p) => (
                <tr key={p._id}>
                  <td className="px-6 py-4">{p.name}</td>
                  <td className="px-6 py-4">{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <CSVLink
          data={lowStock}
          filename={"low_stock_report.csv"}
          className="mt-2 inline-block px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Export CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default Reports;
