import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "../lib/socket";

// Connects the shared socket instance once when the user is
// authenticated, and disconnects it on logout. Falls back to
// localStorage since Redux's auth state resets to null on every page
// refresh (nothing currently rehydrates it on app start).
export const useSocketConnection = () => {
  const reduxUser = useSelector((state) => state.auth.user);
  console.log(reduxUser)
  let storedUser = null;
  try {
    const raw = localStorage.getItem("user");
    storedUser = raw && raw !== "undefined" ? JSON.parse(raw) : null;
  } catch {
    storedUser = null;
  }
  const isLoggedIn = !!(reduxUser || storedUser);

  useEffect(() => {
    if (isLoggedIn && !socket.connected) {
      socket.connect();
    }

    if (!isLoggedIn && socket.connected) {
      socket.disconnect();
    }
  }, [isLoggedIn]);
};