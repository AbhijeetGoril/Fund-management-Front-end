import React from "react";
import { NavLink } from "react-router-dom";

const NavLinks = ({ links = [] }) => {
  // Using DaisyUI theme-aware classes
  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary/20 text-primary border border-primary/30 shadow-sm"
        : "text-base-content/80 hover:text-primary hover:bg-base-200"
    }`;

  return (
    <div className="flex items-center space-x-4">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} className={navLinkClass}>
          {l.label}
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;