import React, { useState } from "react";

const UserAvatar = ({ user, size = "md" }) => {
  const [imgError, setImgError] = useState(false);
  
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };
  const cls = sizes[size] || sizes.md;

  // Get user initial
  const fallback = (user?.displayName?.[0] || user?.email?.[0] || "U").toUpperCase();

  // DaisyUI theme colors
  const getColor = () => {
    if (!user?.uid) return "bg-primary text-primary-content";
    
    const hash = user.uid.charCodeAt(0);
    const colors = [
      "bg-primary text-primary-content",
      "bg-secondary text-secondary-content",
      "bg-accent text-accent-content",
      "bg-info text-info-content",
    ];
    
    return colors[hash % colors.length];
  };

  // Show image if available and not errored
  if (user?.photoURL && !imgError) {
    return (
      <img
        src={user.photoURL}
        alt="Profile"
        className={`${cls} rounded-full object-cover ring-2 ring-base-100 shadow`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Fallback to colored initial
  return (
    <div className={`${cls} flex items-center justify-center rounded-full font-bold shadow ${getColor()}`}>
      {fallback}
    </div>
  );
};

export default UserAvatar;