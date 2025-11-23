import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
  CogIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon, // ✅ correct logout icon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", icon: HomeIcon, path: "/dashboard" },
    { name: "Products", icon: CubeIcon, path: "/products" },
    { name: "Sales", icon: ShoppingCartIcon, path: "/sales" },
    { name: "Purchase", icon: TruckIcon, path: "/purchase" },
    { name: "Customers", icon: UsersIcon, path: "/customers" },
    { name: "Suppliers", icon: UsersIcon, path: "/suppliers" },
    { name: "Employees", icon: UsersIcon, path: "/employees" },
    { name: "Reports", icon: DocumentTextIcon, path: "/reports" },
    { name: "Settings", icon: CogIcon, path: "/settings" },
    { name: "Logout", icon: ArrowLeftOnRectangleIcon, path: "/logout" }, // ✅ fixed
  ];

  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0 flex flex-col p-6 space-y-6">
      <div className="text-2xl font-bold mb-8">IMS Logo</div>

      <nav className="flex-1 flex flex-col space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                  isActive ? "bg-gray-700 font-semibold" : ""
                }`
              }
            >
              <Icon className="h-6 w-6" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
