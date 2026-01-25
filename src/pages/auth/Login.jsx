import { ShipWheelIcon, Mail, Lock, User, AlertCircle, AlertTriangle } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { auth } from "../../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { axiosInstance } from "../../lib/axois";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // React Query mutations
  const loginMutation = useMutation({
    mutationFn: (loginData) => axiosInstance.post('/auth/login', loginData),
    onSuccess: (data) => {
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage.includes("Invalid credentials") || errorMessage.includes("Invalid email or password")) {
        setErrors({ 
          email: "Invalid email or password",
          password: "Invalid email or password" 
        });
      } else if (errorMessage.includes("User not found")) {
        setErrors({ email: "No account found with this email" });
      } else if (errorMessage.includes("required") || errorMessage.includes("missing")) {
        setErrors({ submit: "Email and password are required" });
      } else {
        setErrors({ submit: errorMessage });
      }
      toast.error(errorMessage || "Login failed!");
    }
  });

  const googleLoginMutation = useMutation({
    mutationFn: (idToken) => axiosInstance.post('/auth/google', { },{
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }),
    onSuccess: (data) => {
      toast.success("Login successful!");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Google login error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ google: "Google login was cancelled." });
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ 
          google: "Popup was blocked by your browser. Please allow popups for this site." 
        });
      } else if (error.code === 'auth/network-request-failed') {
        setErrors({ google: "Network error. Please check your connection." });
      } else if (error.response?.data?.message) {
        setErrors({ google: error.response.data.message });
      } else {
        setErrors({ 
          google: error.message || "Google login failed. Please try again." 
        });
      }
      toast.error("Google login failed!");
    }
  });

  const validateForm = () => {
    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) newErrors.email = "Invalid email";
    if (!loginData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Firebase Google Login Handler
  const handleGoogleLogin = async () => {
    setErrors({});

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      googleLoginMutation.mutate(idToken);
      
    } catch (error) {
      console.error("Google signup error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ google: "Google login was cancelled." });
        toast.error("Google login was cancelled.");
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ 
          google: "Popup was blocked by your browser. Please allow popups for this site." 
        });
        toast.error("Popup blocked. Please allow popups for this site.");
      } else if (error.code === 'auth/network-request-failed') {
        setErrors({ google: "Network error. Please check your connection." });
        toast.error("Network error. Please check your connection.");
      } else {
        setErrors({ 
          google: error.message || "Google login failed. Please try again." 
        });
        toast.error("Google login failed!");
      }
    }
  };

  // Handle Regular Login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    loginMutation.mutate(loginData);
  };

  return (
    <>
      {/* Main Login Form - EXACT SAME AS SIGNUP */}
      <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side form - EXACT SAME AS SIGNUP */}
            <div className="w-full lg:w-1/2 p-7">
              {/* Header Section - EXACT SAME AS SIGNUP */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <ShipWheelIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Society Fund</h1>
                    <p className="text-sm text-gray-500">Secure Fund Management</p>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mt-6">Welcome Back</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Sign in to manage your society funds securely
                </p>
              </div>

              {/* Form - EXACT SAME SPACING AS SIGNUP */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field - EXACT SAME AS SIGNUP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 h-11 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'} 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                      value={loginData.email}
                      onChange={handleChange}
                      required
                      disabled={loginMutation.isPending}
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field - EXACT SAME AS SIGNUP */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-blue-600 font-medium hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-4 h-11 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'} 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                      value={loginData.password}
                      onChange={handleChange}
                      required
                      disabled={loginMutation.isPending}
                    />
                  </div>
                  {errors.password && (
                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Remember Me Checkbox - SAME HEIGHT AS TERMS IN SIGNUP */}
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input 
                    type="checkbox" 
                    id="remember"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    disabled={loginMutation.isPending}
                  />
                  <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                    Remember me
                  </label>
                </div>

                {/* Submit Button - EXACT SAME AS SIGNUP */}
                <button 
                  type="submit" 
                  className={`w-full h-11 bg-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center
                    ${loginMutation.isPending ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`} 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="loading loading-spinner loading-sm mr-2"></div>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {errors.submit && (
                  <div className={`p-3 rounded-lg border ${errors.submit.includes("expired") || errors.submit.includes("restart") ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                    <div className="flex items-center gap-2">
                      {errors.submit.includes("expired") || errors.submit.includes("restart") ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      <span className="text-sm font-medium text-gray-800">{errors.submit}</span>
                    </div>
                  </div>
                )}

                {/* Divider - EXACT SAME AS SIGNUP */}
                <div className="relative pt-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Google Login Button - EXACT SAME AS SIGNUP */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`w-full flex items-center justify-center gap-3 h-11 px-4 bg-white text-gray-800 border border-gray-300 
                    rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200
                    ${googleLoginMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={googleLoginMutation.isPending}
                >
                  {googleLoginMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                      <span className="font-medium">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium">Sign in with Google</span>
                    </>
                  )}
                </button>

                {errors.google && (
                  <div className="p-3 rounded-lg border border-red-200 bg-red-50">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-800">{errors.google}</span>
                    </div>
                  </div>
                )}

                {/* Signup Link - EXACT SAME AS SIGNUP LOGIN LINK */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right side - EXACT SAME AS SIGNUP */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-7">
              <div className="text-center max-w-xs mx-auto">
                <div className="mb-6">
                  <img 
                    src="/House_searching-pana.png" 
                    alt="Financial management illustration" 
                    className="w-full max-w-[220px] mx-auto object-contain" 
                  />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">Welcome Back!</h3>
                <p className="text-gray-600 text-sm mb-5">
                  Sign in to access your society fund dashboard and manage finances securely.
                </p>
                
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Secure Access</h4>
                      <p className="text-xs text-gray-600">
                        Your data is protected with industry-standard security
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Quick Login</h4>
                      <p className="text-xs text-gray-600">
                        Google login for instant access to your account
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;