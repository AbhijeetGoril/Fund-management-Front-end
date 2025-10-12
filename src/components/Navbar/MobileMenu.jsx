import React from "react";
import { Link, NavLink } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const MobileMenu = React.forwardRef(function MobileMenu(
  { open, user, links = [], onClose, onLogout },
  ref
) {
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 border border-blue-200"
        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
    }`;

  return (
    <div
      ref={ref}
      className={`absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 transform transition-all duration-300 ease-in-out md:hidden ${
        open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      }`}
      role="menu"
    >
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white transition-colors"
            aria-label="Close menu"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {user && (
          <div className="flex items-center space-x-3">
            <UserAvatar user={user} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 font-semibold truncate text-sm">
                {user.displayName || "No Name"}
              </p>
              <p className="text-gray-500 text-xs truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onClose}
              className={mobileNavLinkClass}
            >
              <span className="text-lg">{l.icon}</span>
              <span className="text-sm">{l.label}</span>
            </NavLink>
          ))}
        </div>

        {user ? (
          <div className="p-3 border-t border-gray-100 space-y-1">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-sm"
            >
              <span className="text-lg">👤</span>
              <span>My Profile</span>
            </Link>
            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors text-sm"
            >
              <span className="text-lg">🔧</span>
              <span>Settings</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100 pt-3 text-sm"
            >
              <span className="text-lg">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-3 border-t border-gray-100 space-y-2">
            <Link
              to="/login"
              onClick={onClose}
              className="block w-full p-3 text-center text-gray-700 hover:text-blue-600 font-medium transition-colors border border-gray-200 rounded-lg hover:border-blue-200 text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="block w-full p-3 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm text-sm"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

export default MobileMenu;
