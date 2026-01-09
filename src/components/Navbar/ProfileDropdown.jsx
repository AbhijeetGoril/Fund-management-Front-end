import React from "react";
import { Link } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const ProfileDropdown = React.forwardRef(function ProfileDropdown(
  { open, user, onLogout, onClose },
  ref
) {
  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-3 w-64 bg-base-100 border border-base-300 rounded-box shadow-lg z-50"
    >
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="md" />
          <div>
            <p className="font-bold text-base-content">
              {user?.displayName || "User"}
            </p>
            <p className="text-sm text-base-content/60">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 hover:bg-base-200 rounded-lg"
        >
          <span>👤</span>
          <span>Profile</span>
        </Link>
        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2 hover:bg-base-200 rounded-lg"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 text-error hover:bg-error/10 rounded-lg w-full mt-2 border-t border-base-300 pt-2"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
});

export default ProfileDropdown;