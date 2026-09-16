import { io } from "socket.io-client";
import { axiosInstance } from "./axois";

// withCredentials sends the httpOnly authToken cookie along with the
// socket handshake — the same cookie authMiddleware reads for every
// REST call. socketAuth.js on the backend parses it from the raw
// handshake headers.
const SOCKET_URL = axiosInstance.defaults.baseURL?.replace("/api", "") || "http://localhost:3000";
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});