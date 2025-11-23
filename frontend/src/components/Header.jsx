import React, { useState } from "react";

const Header = ({ onSearch }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white shadow-md flex justify-between items-center px-6 z-50">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full" />
        <span className="font-bold text-xl text-blue-600">InventoryPro</span>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search products or category..."
          onChange={(e) => onSearch(e.target.value)}
          className="border rounded-md px-3 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Profile
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border">
              <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </a>
              <a href="/logout" className="block px-4 py-2 hover:bg-gray-100">
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
