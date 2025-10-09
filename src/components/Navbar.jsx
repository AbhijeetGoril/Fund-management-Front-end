// Navbar.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef=useRef(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutSide=(event)=>{
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown",handleClickOutSide)
    return () => {
    document.removeEventListener("mousedown", handleClickOutSide);
  };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm  sticky top-0 z-50">
      {/* Logo Section */}
      <Link 
        to="/" 
        className="flex items-center hover:opacity-80 transition-opacity group"
      >
        <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors">
          <div className="w-6 h-6 flex items-center justify-center">🏠</div>
        </div>
        <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          Society Manager
        </h1>
      </Link>

      {/* Navigation Links & User Section */}
      <div className="flex items-center space-x-8">
        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveRoute("/dashboard")
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin-panel"
            className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActiveRoute("/admin-panel")
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Admin Panel
          </Link>
        </div>

        {/* User Section */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
              onClick={handleDropdownToggle}
              className={`flex items-center space-x-2 p-1 rounded-full border-2 transition-all duration-200 ${
                dropdownOpen 
                  ? "border-blue-500 ring-2 ring-blue-100" 
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-sm">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in-0 zoom-in-95">
                {/* User Info Section */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center space-x-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-lg shadow-sm">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-semibold truncate">
                        {user.displayName || "No Name"}
                      </p>
                      <p className="text-gray-500 text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dropdown Actions */}
                <div className="p-2">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span>👤</span>
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </Link>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2 border-t border-gray-100 pt-3"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;