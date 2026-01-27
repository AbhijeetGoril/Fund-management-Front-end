// hooks/useAuthMutations.js
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axois";
import { toast } from "react-toastify";
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




export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (loginData) => axiosInstance.post('/auth/login', loginData),
    onSuccess: (data) => {
      toast.success("Login successful!");
      // Navigation will be handled in component
      return data;
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes("Invalid credentials") || errorMessage.includes("Invalid email or password")) {
        return { 
          fieldErrors: {
            email: "Invalid email or password",
            password: "Invalid email or password" 
          },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("User not found")) {
        return { 
          fieldErrors: { email: "No account found with this email" },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("required") || errorMessage.includes("missing")) {
        return { 
          fieldErrors: { submit: "Email and password are required" },
          generalError: errorMessage
        };
      } else {
        return { 
          fieldErrors: { submit: errorMessage },
          generalError: errorMessage
        };
      }
    }
  });
};

export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: (idToken) => axiosInstance.post('/auth/google', {}, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }),
    onSuccess: (data) => {
      toast.success("Login successful!");
      return data;
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (error.code === 'auth/popup-closed-by-user') {
        return { 
          fieldErrors: { google: "Google login was cancelled." },
          generalError: "Google login was cancelled."
        };
      } else if (error.code === 'auth/popup-blocked') {
        return { 
          fieldErrors: { 
            google: "Popup was blocked by your browser. Please allow popups for this site." 
          },
          generalError: "Popup blocked. Please allow popups."
        };
      } else if (error.code === 'auth/network-request-failed') {
        return { 
          fieldErrors: { google: "Network error. Please check your connection." },
          generalError: "Network error."
        };
      } else if (errorMessage) {
        return { 
          fieldErrors: { google: errorMessage },
          generalError: errorMessage
        };
      } else {
        return { 
          fieldErrors: { google: "Google login failed. Please try again." },
          generalError: "Google login failed!"
        };
      }
    }
  });
};



export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email) => 
      axiosInstance.post('/auth/forget-password', { email }),
    onSuccess: () => {
      toast.success("OTP sent to your email!");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes("User not found")) {
        return { 
          fieldErrors: { email: "No account found with this email" },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("Email is required")) {
        return { 
          fieldErrors: { email: "Email is required" },
          generalError: errorMessage
        };
      } else {
        return { 
          fieldErrors: { email: errorMessage },
          generalError: errorMessage
        };
      }
    }
  });
};

export const useVerifyResetOtpMutation = () => {
  return useMutation({
    mutationFn: ({ email, otp }) => 
      axiosInstance.post('/auth/verify-reset-otp', { email, otp }),
    onSuccess: () => {
      toast.success("OTP verified! You can now reset your password.");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes("OTP expired")) {
        return { 
          fieldErrors: { otp: "OTP has expired. Please request a new one." },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("Invalid OTP")) {
        return { 
          fieldErrors: { otp: "Invalid OTP. Please try again." },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("OTP not found")) {
        return { 
          fieldErrors: { otp: "OTP not found. Please request a new one." },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("Email and OTP are required")) {
        return { 
          fieldErrors: { 
            email: "Email is required",
            otp: "OTP is required" 
          },
          generalError: errorMessage
        };
      } else {
        return { 
          fieldErrors: { otp: errorMessage },
          generalError: errorMessage
        };
      }
    }
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (newPassword) => 
      axiosInstance.post('/auth/reset-password', { newPassword }),
    onSuccess: () => {
      toast.success("Password reset successful! You can now login with your new password.");
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes("Reset session expired")) {
        return { 
          fieldErrors: { 
            password: "Reset session expired. Please start the process again." 
          },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("must be at least 6 characters")) {
        return { 
          fieldErrors: { 
            password: "Password must be at least 6 characters" 
          },
          generalError: errorMessage
        };
      } else if (errorMessage.includes("Invalid reset token")) {
        return { 
          fieldErrors: { 
            password: "Invalid reset session. Please start again." 
          },
          generalError: errorMessage
        };
      } else {
        return { 
          fieldErrors: { password: errorMessage },
          generalError: errorMessage
        };
      }
    }
  });
};