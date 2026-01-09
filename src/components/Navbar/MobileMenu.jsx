import React from "react";
import { Link, NavLink } from "react-router-dom";
import UserAvatar from "./UserAvatar";

const MobileMenu = React.forwardRef(function MobileMenu(
  { open, user, links = [], onClose, onLogout },
  ref
) {
  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-3 rounded-lg font-medium ${
      isActive
        ? "bg-primary/20 text-primary border border-primary/30"
        : "text-base-content hover:bg-base-200"
    }`;

  return (
    <div
      ref={ref}
      className={`absolute top-16 right-4 w-64 bg-base-100 border border-base-300 rounded-box shadow-xl z-50 transform transition-all duration-300 ease-in-out md:hidden ${
        open
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      }`}
      role="menu"
    >
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-base-content">Menu</h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label="Close menu"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {user && (
          <div className="flex items-center space-x-3">
            <UserAvatar user={user} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-base-content font-semibold truncate text-sm">
                {user.displayName || "No Name"}
              </p>
              <p className="text-base-content/60 text-xs truncate">{user.email}</p>
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
          <div className="p-3 border-t border-base-300 space-y-1">
            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-base-content hover:bg-base-200 text-sm"
            >
              <span className="text-lg">👤</span>
              <span>My Profile</span>
            </Link>
            <Link
              to="/settings"
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg text-base-content hover:bg-base-200 text-sm"
            >
              <span className="text-lg">🔧</span>
              <span>Settings</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 w-full p-3 rounded-lg text-error hover:bg-error/10 text-sm mt-2"
            >
              <span className="text-lg">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-3 border-t border-base-300 space-y-2">
            <Link
              to="/login"
              onClick={onClose}
              className="block w-full p-3 text-center text-base-content hover:text-primary font-medium border border-base-300 rounded-lg text-sm"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="block w-full p-3 text-center bg-primary text-primary-content rounded-lg hover:bg-primary/90 font-medium text-sm"
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