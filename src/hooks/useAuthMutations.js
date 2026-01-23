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
      const response = await axiosInstance.post("/auth/verify-otp", { 
        email, 
        otp 
      });
      return response.data;
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async ({ signupToken, ...userData }) => {
      const response = await axiosInstance.post("/users/signup", 
        { 
          password: userData.password, 
          name: userData.fullName 
        }, 
        {
          headers: {
            Authorization: `Bearer ${signupToken}`,
          },
        }
      );
      return response.data;
    },
  });

  return {
    sendOtpMutation,
    verifyOtpMutation,
    signupMutation,
  };
};