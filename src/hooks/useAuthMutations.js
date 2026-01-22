import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

export const useAuthMutations = () => {
  const sendOtpMutation = useMutation({
    mutationFn: async (email) => {
      const response = await axiosInstance.post("/auth/send-otp", { email });
      return response.data;
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otp }) => {
      const response = await axiosInstance.post("/auth/verify-otp", { email, otp });
      return response.data;
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async ({ signupToken, ...userData }) => {
      const response = await axiosInstance.post("/auth/signup", userData, {
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
    createUserMutation,
  };
};