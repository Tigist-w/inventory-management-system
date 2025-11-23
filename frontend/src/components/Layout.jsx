import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      {/* Sidebar */}
      <Sidebar />

      {/* Topbar */}
      <Topbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Main content */}
      <main className="ml-64 pt-16 p-6">{children}</main>
    </div>
  );
};

export default Layout;
