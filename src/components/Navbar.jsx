// Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm mb-4">
      <div className="flex items-center">
        <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
          🏠
        </div>
        <h1 className="text-xl font-bold text-gray-800">Society Manager</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <Link 
          to="/dashboard" 
          className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          Dashboard
        </Link>
        <Link 
          to="/admin-panel" 
          className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          Admin Panel
        </Link>
        <button 
          onClick={handleLogout} 
          className="text-gray-600 hover:text-red-600 font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;