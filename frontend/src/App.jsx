import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Purchase from "./pages/Purchase";
import Customers from "./pages/Customers";
import Suppliers from "./pages/Suppliers";
import Employees from "./pages/Employees";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { isAuthenticated, logout } from "./utils/auth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InnerApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        logout();
        navigate("/login");
      }
    }, 1000 * 60);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
      <Header onSearch={setSearchTerm} />
      <Sidebar />
      <Topbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <main className="ml-64 mt-16 p-6 min-h-screen bg-gray-50 transition-all">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
            }
          />

          <Route
            path="/products"
            element={
              isAuthenticated() ? (
                <Products searchTerm={searchTerm} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/sales"
            element={isAuthenticated() ? <Sales /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase"
            element={
              isAuthenticated() ? <Purchase /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/customers"
            element={
              isAuthenticated() ? <Customers /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/suppliers"
            element={
              isAuthenticated() ? <Suppliers /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/employees"
            element={
              isAuthenticated() ? <Employees /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated() ? <Settings /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/reports"
            element={isAuthenticated() ? <Reports /> : <Navigate to="/login" />}
          />
          <Route path="/logout" element={<Logout />} />
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <InnerApp />
    </Router>
  );
}
