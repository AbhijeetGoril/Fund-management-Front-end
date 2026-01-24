// hooks/useAuthMutations.js
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axois";

export const useAuthMutations = () => {
  // Send OTP mutation
  const sendOtp = useMutation({
    mutationFn: async (email) => {
      const response = await axiosInstance.post("/auth/send-otp", { email });
      return response.data;
    },
  });

  // Verify OTP mutation
  const verifyOtp = useMutation({
    mutationFn: async ({ email, otp }) => {
      const response = await axiosInstance.post("/auth/verify-otp", { 
        email, 
        otp 
      });
      return response.data;
    },
  });

  // Signup mutation
  
  const signup = useMutation({
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

  // Google auth mutation
  const googleSignup = useMutation({
    mutationFn: async (googleToken) => {
      const response = await axiosInstance.post("/auth/google", {}, {
        headers: {
          Authorization: `Bearer ${googleToken}`,
        },
      });
      return response.data;
    },
  });

  return {
    sendOtp,
    verifyOtp,
    signup,
    googleSignup,
    // For backward compatibility
    sendOtpMutation: sendOtp,
    verifyOtpMutation: verifyOtp,
    signupMutation: signup,
    googleSignupMutation: googleSignup,
  };
};


