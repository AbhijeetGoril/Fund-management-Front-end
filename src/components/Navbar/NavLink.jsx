import React from "react";
import { NavLink } from "react-router-dom";

const NavLinks = ({ links = [] }) => {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 border border-blue-200"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <div className="flex items-center space-x-6">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} className={navLinkClass}>
          {l.label}
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;
