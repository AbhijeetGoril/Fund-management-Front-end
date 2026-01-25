import { ShipWheelIcon, Mail, Key, Lock, User, AlertCircle, AlertTriangle, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthMutations } from "../../hooks/useAuthMutations";
import { auth } from "../../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    sendOtp,
    verifyOtp,
    signup,
    googleSignup,
  } = useAuthMutations();

  const [signupData, setSignupData] = useState({
    fullName: "",
    password: "",
    email: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [signupToken, setSignupToken] = useState("");
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  
  const otpRefs = useRef([]);

  // Loading states from mutations
  const loading = {
    sendingOtp: sendOtp.isPending,
    verifyingOtp: verifyOtp.isPending,
    signingUp: signup.isPending,
    googleSignup: googleSignup.isPending,
  };

  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimer]);

  useEffect(() => {
    if (otpSent && !otpVerified) {
      setShowOtpPopup(true);
    }
  }, [otpSent, otpVerified]);

  // Handle mutation errors
  useEffect(() => {
    if (sendOtp.error) {
      handleMutationError(sendOtp.error, 'email');
    }
    if (verifyOtp.error) {
      handleMutationError(verifyOtp.error, 'otp');
    }
    if (signup.error) {
      handleMutationError(signup.error, 'submit');
    }
    if (googleSignup.error) {
      handleMutationError(googleSignup.error, 'google');
    }
  }, [sendOtp.error, verifyOtp.error, signup.error, googleSignup.error]);

  const handleMutationError = (error, field) => {
    let errorMessage = "An error occurred";
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Handle specific error messages
    if (errorMessage.includes("already verified") || errorMessage.includes("already exists")) {
      setErrors({ 
        email: "Email already exists. Please login or use a different email.",
      });
    } else if (errorMessage.includes("not found") || errorMessage.includes("expired")) {
      setErrors({ [field]: "OTP not found or expired. Please request a new one." });
    } else if (errorMessage.includes("Invalid OTP") || errorMessage.includes("invalid")) {
      setErrors({ [field]: "Invalid OTP. Please check and try again." });
    } else if (errorMessage.includes("token expired")) {
      setErrors({ 
        submit: "Session expired. Please restart the signup process.",
        email: "Session expired. Please restart."
      });
      setOtpSent(false);
      setOtpVerified(false);
      setSignupToken("");
    } else if (errorMessage.includes("Email not verified")) {
      setErrors({ 
        submit: "Email not verified. Please verify your email first.",
        otp: "Email verification required"
      });
      setOtpVerified(false);
    } else if (errorMessage.includes("User not found")) {
      setErrors({ 
        submit: "User not found. Please restart the signup process.",
        email: "Please restart signup"
      });
      setOtpSent(false);
      setOtpVerified(false);
      setSignupToken("");
    } else if (field === 'google') {
      setErrors({ 
        google: errorMessage || "Google signup failed. Please try again."
      });
    } else {
      // For 400 Bad Request, show more specific message
      if (error.response?.status === 400) {
        setErrors({ 
          [field]: errorMessage || "Invalid request. Please check your input and try again."
        });
      } else {
        setErrors({ [field]: errorMessage });
      }
    }
  };

  // Firebase Google Signup Handler
  const handleGoogleSignup = async () => {
    setErrors({});

    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      googleSignup.mutate(idToken, {
        onSuccess: (data) => {
          navigate("/dashboard");
        },
        onError: (error) => {
          handleMutationError(error, 'google');
        }
      });
      
    } catch (error) {
      console.error("Google signup error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setErrors({ google: "Google signup was cancelled." });
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
      } else {
        setErrors({ 
          google: error.message || "Google signup failed. Please try again." 
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!signupData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!signupData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) newErrors.email = "Invalid email";
    if (!signupData.password) newErrors.password = "Password is required";
    else if (signupData.password.length < 6) newErrors.password = "Minimum 6 characters";
    
    const otpString = otp.join("");
    if (!otpString && otpSent) newErrors.otp = "OTP is required";
    if (otpString && otpString.length !== 6) newErrors.otp = "OTP must be 6 digits";
    return newErrors;
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: "" }));
    }

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit;
        }
      });
      setOtp(newOtp);
      
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      otpRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    const emailError = !signupData.email.trim() ? "Email is required" : 
                       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email) ? "Invalid email" : "";
    
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});

    sendOtp.mutate(signupData.email, {
      onSuccess: () => {
        setOtpSent(true);
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
      },
      onError: (error) => {
        handleMutationError(error, 'email');
      }
    });
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const otpString = otp.join("");
    
    if (!otpString) {
      setErrors({ otp: "OTP is required" });
      return;
    }
    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter all 6 digits" });
      return;
    }

    setErrors({});

    verifyOtp.mutate(
      { email: signupData.email, otp: otpString },
      {
        onSuccess: (data) => {
          setSignupToken(data.signupToken || data.token);
          setOtpVerified(true);
          setShowOtpPopup(false);
        },
        onError: (error) => {
          handleMutationError(error, 'otp');
        }
      }
    );
  };

  // Complete Signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!otpVerified) {
      setErrors({ submit: "Please verify your OTP first" });
      return;
    }

    setErrors({});

    signup.mutate(
      { 
        ...signupData,
        signupToken 
      },
      {
        onSuccess: () => {
          navigate("/login");
        },
        onError: (error) => {
          handleMutationError(error, 'submit');
        }
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (errors.submit) {
      setErrors((prev) => ({ ...prev, submit: "" }));
    }
  };

  const resendOtp = () => {
    if (resendTimer > 0) return;
    
    setOtp(["", "", "", "", "", ""]);
    setErrors({});
    setResendTimer(60);
    
    sendOtp.mutate(signupData.email, {
      onSuccess: () => {
        otpRefs.current[0]?.focus();
      },
      onError: (error) => {
        handleMutationError(error, 'otp');
      }
    });
  };

  const closeOtpPopup = () => {
    setShowOtpPopup(false);
    setOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
    setErrors({});
  };

  return (
    <>
      {/* OTP Verification Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300 border border-gray-200">
            <button
              onClick={closeOtpPopup}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm border border-blue-200">
                <Key className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Verify Your Email</h3>
              <p className="text-sm text-gray-600 mt-2">
                Enter the 6-digit code sent to
                <br />
                <span className="font-semibold text-blue-600">{signupData.email}</span>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-14 h-14 text-center text-2xl font-bold rounded-lg transition-all border-2
                      ${errors.otp ? 'border-red-500 bg-red-50' : 'border-gray-300'} 
                      ${digit ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none`}
                    disabled={loading.verifyingOtp}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {errors.otp && (
                <div className="text-center mb-4">
                  <span className="text-sm text-red-600 flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.otp}
                  </span>
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                className={`w-full h-11 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center
                  ${loading.verifyingOtp ? "opacity-70 cursor-not-allowed" : ""}
                  ${otp.join("").length !== 6 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading.verifyingOtp || otp.join("").length !== 6}
              >
                {loading.verifyingOtp ? (
                  <>
                    <div className="loading loading-spinner loading-sm mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
              <button
                onClick={resendOtp}
                className={`text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50
                  ${resendTimer > 0 || loading.sendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={resendTimer > 0 || loading.sendingOtp}
              >
                {loading.sendingOtp ? (
                  <>
                    <div className="loading loading-spinner loading-xs mr-2"></div>
                    Sending...
                  </>
                ) : resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">The OTP will expire in 10 minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Signup Form */}
      <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side form */}
            <div className="w-full lg:w-1/2 p-7">
              {/* Header Section */}
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
                
                <h2 className="text-xl font-bold text-gray-900 mt-6">Create Account</h2>
                <p className="text-gray-600 text-sm mt-1">
                  Join thousands of society members managing funds securely
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSignUp} className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 h-11 rounded-lg border ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'} 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                      value={signupData.fullName}
                      onChange={handleChange}
                      required
                      disabled={otpVerified}
                    />
                  </div>
                  {errors.fullName && (
                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="flex items-center gap-2">
                      {/* {loading.sendingOtp && (
                        <div className="flex items-center gap-1">
                          <div className="loading loading-spinner loading-xs text-blue-600"></div>
                          <span className="text-xs text-blue-600 font-medium">Sending...</span>
                        </div>
                      )} */}
                      {otpSent && !otpVerified && !loading.sendingOtp && (
                        <span className="badge badge-sm badge-info gap-1 bg-blue-100 text-blue-800 border-blue-200">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          OTP Sent
                        </span>
                      )}
                      {otpVerified && (
                        <span className="badge badge-sm badge-success gap-1 bg-green-100 text-green-800 border-green-200">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`w-5 h-5 ${loading.sendingOtp ? 'text-blue-600 animate-pulse' : 'text-gray-400'}`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 h-11 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'} 
                          ${loading.sendingOtp ? 'border-blue-300' : ''}
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                        value={signupData.email}
                        onChange={handleChange}
                        required
                        disabled={otpSent || loading.sendingOtp}
                      />
                    </div>
                    
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className={`h-11 px-4 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center justify-center
                          ${otpSent 
                            ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'}
                          ${loading.sendingOtp ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading.sendingOtp || otpSent}
                      >
                        {loading.sendingOtp ? (
                          <>
                            <div className="loading loading-spinner loading-sm mr-2"></div>
                            Sending...
                          </>
                        ) : otpSent ? (
                          "Sent ✓"
                        ) : (
                          "Send OTP"
                        )}
                      </button>
                    )}
                  </div>
                  
                  {otpSent && !otpVerified && !loading.sendingOtp && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-full">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-blue-800">
                            <span className="font-semibold">OTP sent!</span> Check your email.
                            <button 
                              onClick={() => setShowOtpPopup(true)}
                              className="text-blue-600 font-semibold ml-1 hover:underline"
                            >
                              Click to enter OTP
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {errors.email && (
                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <span className="text-sm text-gray-500">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Create a strong password"
                      className={`w-full pl-10 pr-4 h-11 rounded-lg border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'} 
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all`}
                      value={signupData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      disabled={!otpVerified}
                    />
                  </div>
                  {errors.password && (
                    <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input 
                    type="checkbox" 
                    id="terms"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                    required 
                    disabled={!otpVerified}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                    I agree to the <a href="#" className="text-blue-600 font-medium hover:underline">Terms</a> and{" "}
                    <a href="#" className="text-blue-600 font-medium hover:underline">Privacy Policy</a>
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className={`w-full h-11 bg-blue-600 text-white font-medium rounded-lg transition-all flex items-center justify-center
                    ${loading.signingUp ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}
                    ${!otpVerified ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  disabled={loading.signingUp || !otpVerified}
                >
                  {loading.signingUp ? (
                    <>
                      <div className="loading loading-spinner loading-sm mr-2"></div>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
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

                {/* Divider */}
                <div className="relative pt-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Google Signup Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignup}
                  className={`w-full flex items-center justify-center gap-3 h-11 px-4 bg-white text-gray-800 border border-gray-300 
                    rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200
                    ${loading.googleSignup ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading.googleSignup}
                >
                  {loading.googleSignup ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
                      <span className="font-medium">Signing up...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="font-medium">Sign up with Google</span>
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

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right side */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-7">
              <div className="text-center max-w-xs mx-auto">
                <div className="mb-6">
                  <img 
                    src="/House_searching-pana.png" 
                    alt="Financial management illustration" 
                    className="w-full max-w-[220px] mx-auto object-contain" 
                  />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">Secure Fund Management</h3>
                <p className="text-gray-600 text-sm mb-5">
                  Join thousands of society members efficiently managing their funds securely.
                </p>
                
                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Key className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Secure Verification</h4>
                      <p className="text-xs text-gray-600">
                        OTP verification ensures account security
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">Quick Signup</h4>
                      <p className="text-xs text-gray-600">
                        Google signup for instant access
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

export default SignUp;