import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Topbar = ({ searchTerm, setSearchTerm }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-64 right-0 bg-white shadow-md px-6 py-3 flex justify-between items-center z-50">
      {/* Search */}
      <div className="flex items-center gap-2 w-1/2">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="flex items-center gap-2"
        >
          <UserCircleIcon className="h-8 w-8 text-gray-600" />
          <span className="font-medium text-gray-700">Admin</span>
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 flex flex-col">
            <a href="/settings" className="px-4 py-2 hover:bg-gray-100">
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-left hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
