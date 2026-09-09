import { io } from "socket.io-client";
import { axiosInstance } from "./axois";

// Reads the auth token the same way axiosInstance does for REST calls.
// Your authMiddleware reads the JWT from an httpOnly cookie
// (req.cookies?.authToken), which the browser sends automatically on
// same-origin/CORS-credentialed requests — but raw WebSocket handshakes
// don't automatically forward cookies the same way axios does, so we
// pass withCredentials so the browser attaches the cookie to the
// socket handshake request itself.
const SOCKET_URL = axiosInstance.defaults.baseURL?.replace("/api", "") || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // we connect manually once we know the user is logged in
});