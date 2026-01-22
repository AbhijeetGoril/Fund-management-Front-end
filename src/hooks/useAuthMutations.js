// hooks/useAuthMutations.js
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axois";

export const useAuthMutations = () => {
  // Send OTP mutation
  const sendOtpMutation = useMutation({
    mutationFn: async (email) => {
      const response = await axiosInstance.post("/auth/send-otp", { email });
      return response.data;
    },
  });

  // Verify OTP mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otp }) => {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
      return response.data;
    },
  });

  // Set Password mutation
  const setPasswordMutation = useMutation({
    mutationFn: async ({ signupToken, ...userData }) => {
      const response = await axiosInstance.post("/auth/set-password", userData, {
        headers: {
          Authorization: `Bearer ${signupToken}`,
        },
      });
      return response.data;
    },
  });

  return {
    sendOtpMutation,
    verifyOtpMutation,
    setPasswordMutation,
  };
};