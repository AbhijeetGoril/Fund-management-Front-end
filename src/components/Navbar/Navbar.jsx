import React, { useEffect, useState, useRef, useCallback } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLink";
import UserAvatar from "./UserAvatar";
import ProfileDropdown from "./ProfileDropdown";
import MobileMenu from "./MobileMenu";
import ThemeSelector from "./ThemeSeletor";
import NotificationBell from "../../components/notifications/NotificationBell";
import { axiosInstance } from "../../lib/axois";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const desktopDropdownRef = useRef(null);
  const desktopButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Error fetching user:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const closeAll = useCallback(() => {
    setDesktopDropdownOpen(false);
    setMobileMenuOpen(false);
  }, []);

  const onLogout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      dispatch(logout());
      closeAll();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [dispatch, closeAll]);

  useEffect(() => {
    const onPointerDown = (e) => {
      const t = e.target;

      const clickDeskBtn = desktopButtonRef.current?.contains(t);
      const clickDeskMenu = desktopDropdownRef.current?.contains(t);

      if (!clickDeskBtn && !clickDeskMenu) {
        setDesktopDropdownOpen(false);
      }

      const clickMobBtn = mobileButtonRef.current?.contains(t);
      const clickMobMenu = mobileMenuRef.current?.contains(t);

      if (!clickMobBtn && !clickMobMenu) {
        setMobileMenuOpen(false);
      }
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
  }, [closeAll]);

  if (loading) {
    return (
      <nav className="bg-base-100 p-4 border-b border-base-300 shadow-sm sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <Logo homeTo={homeTo} logo={logo} title={title} />
          <div className="flex items-center space-x-4">
            <div className="animate-pulse h-10 w-20 bg-base-300 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-base-100 p-4 border-b border-base-300 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Logo homeTo={homeTo} logo={logo} title={title} onClick={closeAll} />

        <div className="hidden md:flex items-center space-x-6">
          <NavLinks links={links} />

          <ThemeSelector />

          {user && <NotificationBell />}

          {user ? (
            <div className="relative">
              <button
                ref={desktopButtonRef}
                onClick={() => setDesktopDropdownOpen((s) => !s)}
                className={`flex items-center space-x-2 p-1 rounded-full border-2 transition-all duration-200 ${
                  desktopDropdownOpen
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-base-300"
                }`}
                aria-haspopup="menu"
                aria-expanded={desktopDropdownOpen}
              >
                <UserAvatar
                  user={{
                    photoURL: user.profilePicture,
                    displayName: user.name || user.email,
                    email: user.email,
                  }}
                  size="md"
                />
              </button>

              <ProfileDropdown
                ref={desktopDropdownRef}
                open={desktopDropdownOpen}
                user={{
                  ...user,
                  displayName: user.name || user.email,
                  photoURL: user.profilePicture,
                }}
                onLogout={onLogout}
                onClose={() => setDesktopDropdownOpen(false)}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <a
                href="/login"
                className="px-4 py-2 text-base-content/70 hover:text-primary font-medium transition-colors"
              >
                Login
              </a>

              <a
                href="/signup"
                className="px-4 py-2 bg-primary text-primary-content rounded-lg hover:bg-primary/90 font-medium transition-colors shadow-sm"
              >
                Sign Up
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 md:hidden">
          <div className="mr-2">
            <ThemeSelector />
          </div>

          {user && (
            <div className="mr-1">
              <NotificationBell />
            </div>
          )}

          {user && (
            <button
              ref={desktopButtonRef}
              onClick={() => setDesktopDropdownOpen((s) => !s)}
              className="flex items-center space-x-2 p-1 rounded-full border-2 border-transparent hover:border-base-300 transition-all duration-200"
              aria-haspopup="menu"
              aria-expanded={desktopDropdownOpen}
            >
              <UserAvatar
                user={{
                  photoURL: user.profilePicture,
                  displayName: user.name || user.email,
                }}
                size="sm"
              />
            </button>
          )}

          <button
            ref={mobileButtonRef}
            onClick={() => setMobileMenuOpen((s) => !s)}
            className="p-2 rounded-lg text-base-content hover:text-primary hover:bg-base-200 transition-colors"
            aria-haspopup="menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        ref={mobileMenuRef}
        open={mobileMenuOpen}
        user={
          user
            ? {
                ...user,
                displayName: user.name || user.email,
                photoURL: user.profilePicture,
              }
            : null
        }
        links={links}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={onLogout}
      />
    </nav>
  );
};

export default Navbar;