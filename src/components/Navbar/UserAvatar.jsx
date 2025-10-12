import React from "react";

const UserAvatar = ({ user, size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
  };
  const cls = sizes[size] || sizes.md;

  if (user?.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt="Profile"
        className={`${cls} rounded-full object-cover`}
      />
    );
  }
  const fallback = (user?.email?.[0] ?? "U").toUpperCase();
  return (
    <div className={`${cls} flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold shadow-sm`}>
      {fallback}
    </div>
  );
};

export default UserAvatar;
