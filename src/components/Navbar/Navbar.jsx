import React, { useEffect, useState, useRef, useCallback } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Logo from "./Logo";
import NavLinks from "./NavLink";
import UserAvatar from "./UserAvatar";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import { auth } from "../../firebase/firebaseConfig";
const Navbar = ({
  
  title = "Society Manager",
  homeTo = "/",
  logo = "🏠",
  links = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin-panel", label: "Admin Panel", icon: "⚙️" },
  ],
}) => {
  const [user, setUser] = useState(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Refs
  const desktopDropdownRef = useRef(null);
  const desktopButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);

  // Auth listener
  useEffect(() => {
    if (!auth) return;
    console.log(auth)
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub && unsub();
  }, []); // Cleanup to avoid multiple subscriptions [web:54][web:47]

  const closeAll = useCallback(() => {
    setDesktopDropdownOpen(false);
    setMobileMenuOpen(false);
  }, []);

  const onLogout = useCallback(async () => {
    try {
      await signOut(auth);
      closeAll();
    } catch (e) {
      console.error("Logout failed:", e?.message);
    }
  }, [closeAll]);

  // Outside click + Escape
  useEffect(() => {
    const onPointerDown = (e) => {
      const t = e.target;

      const clickDeskBtn = desktopButtonRef.current?.contains(t);
      const clickDeskMenu = desktopDropdownRef.current?.contains(t);
      if (!clickDeskBtn && !clickDeskMenu) setDesktopDropdownOpen(false);

      const clickMobBtn = mobileButtonRef.current?.contains(t);
      const clickMobMenu = mobileMenuRef.current?.contains(t);
      if (!clickMobBtn && !clickMobMenu) setMobileMenuOpen(false);
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeAll();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeAll]); // Common pattern for reusable components [web:41]
  console.log(user)
  return (
    <nav className="bg-white p-4 border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Logo homeTo={homeTo} logo={logo} title={title} onClick={closeAll} />

        {/* Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks links={links} />

          {user ? (
            <div className="relative">
              <button
                ref={desktopButtonRef}
                onClick={() => setDesktopDropdownOpen((s) => !s)}
                className={`flex items-center space-x-2 p-1 rounded-full border-2 transition-all duration-200 ${
                  desktopDropdownOpen
                    ? "border-blue-500 ring-2 ring-blue-100"
                    : "border-transparent hover:border-gray-300"
                }`}
                aria-haspopup="menu"
                aria-expanded={desktopDropdownOpen}
              >
                <UserAvatar user={user} size="md" />
              </button>

              <ProfileDropdown
                ref={desktopDropdownRef}
                open={desktopDropdownOpen}
                user={user}
                onLogout={onLogout}
                onClose={() => setDesktopDropdownOpen(false)}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Login
              </a>
              <a
                href="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-3 md:hidden">
          {user && (
            <button
              ref={desktopButtonRef}
              onClick={() => setDesktopDropdownOpen((s) => !s)}
              className="flex items-center space-x-2 p-1 rounded-full border-2 border-transparent hover:border-gray-300 transition-all duration-200"
              aria-haspopup="menu"
              aria-expanded={desktopDropdownOpen}
            >
              <UserAvatar user={user} size="sm" />
            </button>
          )}
          <button
            ref={mobileButtonRef}
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            aria-haspopup="menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <span className="text-2xl">✕</span> : <span className="text-2xl">☰</span>}
          </button>
        </div>
      </div>
          
      <MobileMenu
        ref={mobileMenuRef}
        open={mobileMenuOpen}
        user={user}
        links={links}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={onLogout}
      />
    </nav>
  );
};

export default Navbar;
