import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout
    logout();

    // Redirect to login page
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Logging out...
        </h2>
        <p className="text-gray-500">
          You are being logged out and will be redirected shortly.
        </p>
      </div>
    </div>
  );
};

export default Logout;
