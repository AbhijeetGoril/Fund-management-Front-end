import { io } from "socket.io-client";
import { axiosInstance } from "./axois";

const SOCKET_URL =
  axiosInstance.defaults.baseURL?.replace(/\/api\/?$/, "");

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});