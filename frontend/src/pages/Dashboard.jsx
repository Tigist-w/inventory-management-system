import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../services/api";
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

const Dashboard = () => {
  const [summary, setSummary] = useState({});
  const [recent, setRecent] = useState({});
  const [chartData, setChartData] = useState(null);

  const loadDashboard = async () => {
    try {
      const [summaryRes, recentRes, chartRes] = await Promise.all([
        API.get("/dashboard/summary"),
        API.get("/dashboard/recent"),
        API.get("/dashboard/chart"),
      ]);

      setSummary(summaryRes.data);
      setRecent(recentRes.data);

      setChartData({
        labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
        datasets: [
          {
            label: "Sales",
            data: Array(12)
              .fill(0)
              .map(
                (_, i) =>
                  chartRes.data.sales.find((s) => s._id === i + 1)?.total || 0
              ),
            borderColor: "green",
            backgroundColor: "rgba(0,255,0,0.2)",
          },
          {
            label: "Purchases",
            data: Array(12)
              .fill(0)
              .map(
                (_, i) =>
                  chartRes.data.purchases.find((p) => p._id === i + 1)?.total ||
                  0
              ),
            borderColor: "blue",
            backgroundColor: "rgba(0,0,255,0.2)",
          },
        ],
      });
    } catch (err) {
      console.error("Dashboard Load Error:", err);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="Total Sales" value={summary.totalSales} color="green" />
          <Card
            title="Total Purchases"
            value={summary.totalPurchases}
            color="blue"
          />
          <Card
            title="Total Products"
            value={summary.totalProducts}
            color="yellow"
          />
          <Card title="Low Stock" value={summary.lowStock} color="red" />
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-3">Sales vs Purchases</h2>
          {chartData && <Line data={chartData} />}
        </div>

        {/* Recent Items */}
        <Section title="Recent Sales" data={recent.recentSales} type="sales" />
        <Section
          title="Recent Purchases"
          data={recent.recentPurchases}
          type="purchases"
        />
        <Section
          title="Recently Added Products"
          data={recent.recentProducts}
          type="products"
        />
      </div>
    </Layout>
  );
};

// Components
const Card = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-md text-white bg-${color}-500`}>
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

const Section = ({ title, data = [], type }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <table className="min-w-full divide-y divide-gray-200">
      <tbody>
        {data?.map((item) => (
          <tr key={item._id}>
            {type === "products" && (
              <>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.stock}</td>
              </>
            )}
            {type === "sales" && (
              <>
                <td>{item.product?.name}</td>
                <td>{item.quantity}</td>
                <td>${item.quantity * item.price}</td>
              </>
            )}
            {type === "purchases" && (
              <>
                <td>{item.product?.name}</td>
                <td>{item.quantity}</td>
                <td>${item.quantity * item.price}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Dashboard;
