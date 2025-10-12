import React from "react";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const ProfileDropdown = React.forwardRef(function ProfileDropdown(
  { open, user, onLogout, onClose },
  ref
) {
  return (
    <div
      ref={ref}
      className={`absolute right-0 mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50 transition transform duration-150 origin-top-right ${
        open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      }`}
      role="menu"
    >
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 font-semibold truncate">
              {user?.displayName || "No Name"}
            </p>
            <p className="text-gray-500 text-sm truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          role="menuitem"
        >
          <span>👤</span>
          <span>My Profile</span>
        </Link>
        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          role="menuitem"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2 border-t border-gray-100 pt-3"
          role="menuitem"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
});

export default ProfileDropdown;
