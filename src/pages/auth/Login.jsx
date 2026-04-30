import { ShipWheelIcon, Mail, Lock, User, AlertCircle, AlertTriangle } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { useLoginMutation, useGoogleLoginMutation } from "../../hooks/useAuthMutations";
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the custom hooks for mutations
  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();

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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: "" }));
    }
    if (errors.google) {
      setErrors((prev) => ({ ...prev, google: "" }));
    }
  };

  // Enhanced error handler for login
  const handleLoginError = (error) => {
    setIsSubmitting(false);
    let errorMessage = "An error occurred";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Handle specific error messages
    if (errorMessage.includes("Invalid credentials") || errorMessage.includes("Invalid email or password")) {
      setErrors({ 
        email: "Invalid email or password",
        password: "Invalid email or password" 
      });
    } else if (errorMessage.includes("User not found")) {
      setErrors({ 
        email: "No account found with this email. Please sign up first.",
      });
    } else if (errorMessage.includes("required") || errorMessage.includes("missing")) {
      setErrors({ 
        email: "Email is required",
        password: "Password is required"
      });
    } else if (errorMessage.includes("account locked") || errorMessage.includes("suspended")) {
      setErrors({ 
        submit: "Your account is temporarily locked. Please contact support.",
      });
    } else if (errorMessage.includes("too many attempts")) {
      setErrors({ 
        submit: "Too many failed attempts. Please try again later.",
      });
    } else if (errorMessage.includes("network")) {
      setErrors({ 
        submit: "Network error. Please check your connection.",
      });
    } else {
      setErrors({ submit: errorMessage });
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
      
      setIsSubmitting(true);
      
      const response = await googleLoginMutation.mutateAsync(idToken);
      const userData = response.data?.user || response.user;
      const token = response.data?.token || response.token;
    
      dispatch(setUser({ user: userData, token }));
      navigate("/dashboard");

      
    } catch (error) {
      setIsSubmitting(false);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ google: "Google login was cancelled." });
      } else if (error.code === 'auth/popup-blocked') {
        setErrors({ 
          google: "Popup was blocked by your browser. Please allow popups for this site." 
        });
      } else if (error.code === 'auth/network-request-failed') {
        setErrors({ google: "Network error. Please check your connection." });
      } else if (error.code === 'auth/unauthorized-domain') {
        setErrors({ 
          google: "This domain is not authorized for Google sign-in. Please contact support." 
        });
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        setErrors({ 
          google: "An account already exists with the same email address but different sign-in credentials." 
        });
      } else if (error.code === 'auth/operation-not-allowed') {
        setErrors({ 
          google: "Google sign-in is not enabled. Please contact support." 
        });
      } else {
        setErrors({ google: error.message || "Google login failed. Please try again." });
      }
    }
  };

  // Handle Regular Login
  const handleLogin = async (e) => {
  e.preventDefault();
  setErrors({});
  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  setIsSubmitting(true);
  try {
    const response = await loginMutation.mutateAsync(loginData);
    
    // ✅ NEW: Save user & token to Redux
    // You need to know the shape of `response`.
    // Common shapes:
    //   - response.data.user, response.data.token
    //   - response.user, response.token
    //   - response itself is the user object
    // Check by doing console.log(response)
    const userData = response.data?.user || response.user;
    const token = response.data?.token || response.token;
    
    dispatch(setUser({ user: userData, token }));
    
    navigate("/dashboard");
  } catch (error) {
    handleLoginError(error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <>
      {/* Main Login Form */}
      <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-base-100 via-base-50 to-base-100">
        <div className="w-full max-w-5xl bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side form */}
            <div className="w-full lg:w-1/2 p-7">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                    <ShipWheelIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-base-content">Society Fund</h1>
                    <p className="text-sm text-base-content/70">Secure Fund Management</p>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-base-content mt-6">Welcome Back</h2>
                <p className="text-base-content/70 text-sm mt-1">
                  Sign in to manage your society funds securely
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">Email Address</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 ${
                        isSubmitting ? 'text-primary animate-pulse' : 'text-base-content/40'
                      }`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className={`input input-bordered w-full pl-11 h-11 ${errors.email ? 'input-error' : ''}`}
                      value={loginData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <div className="mt-2 flex items-center gap-1 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="form-control">
                  <div className="flex justify-between items-center mb-2">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Password</span>
                    </label>
                    <Link to="/forgot-password" className="label-text-alt link link-primary font-medium">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-base-content/40" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      className={`input input-bordered w-full pl-11 h-11 ${errors.password ? 'input-error' : ''}`}
                      value={loginData.password}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {/* {errors.password && (
                    <div className="mt-2 flex items-center gap-1 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </div>
                  )} */}
                </div>

                {/* Remember Me Checkbox */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 hover:bg-base-200 p-2 rounded-lg transition-colors">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-primary" 
                      disabled={isSubmitting}
                    />
                    <span className="label-text text-base-content">
                      Remember me
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full h-11 ${isSubmitting ? 'loading' : ''}`} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>

                {/* Form-level errors */}
                {errors.submit && (
                  <div className={`alert ${errors.submit.includes("locked") || errors.submit.includes("attempts") ? 'alert-error' : 'alert-warning'} shadow-sm`}>
                    {errors.submit.includes("locked") || errors.submit.includes("attempts") ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">{errors.submit}</span>
                  </div>
                )}

                {/* Divider */}
                <div className="divider text-base-content/50">Or continue with</div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className={`btn btn-outline w-full h-11 ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {!isSubmitting && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                  {isSubmitting ? "Signing in..." : "Sign in with Google"}
                </button>

                {errors.google && (
                  <div className="alert alert-error shadow-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{errors.google}</span>
                  </div>
                )}

                {/* Signup Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-base-content/70">
                    Don't have an account?{" "}
                    <Link to="/signup" className="link link-primary font-semibold">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right side */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/5 p-7">
              <div className="text-center max-w-xs mx-auto">
                <div className="mb-6">
                  <img 
                    src="/House_searching-pana.png" 
                    alt="Financial management illustration" 
                    className="w-full max-w-[220px] mx-auto object-contain" 
                  />
                </div>
                
                <h3 className="text-lg font-bold text-base-content mb-3">Welcome Back!</h3>
                <p className="text-base-content/70 text-sm mb-5">
                  Sign in to access your society fund dashboard and manage finances securely.
                </p>
                
                <div className="p-4 bg-base-100/50 backdrop-blur-sm rounded-lg border border-base-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-base-content text-sm mb-1">Secure Access</h4>
                      <p className="text-xs text-base-content/70">
                        Your data is protected with industry-standard security
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-base-content text-sm mb-1">Quick Login</h4>
                      <p className="text-xs text-base-content/70">
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