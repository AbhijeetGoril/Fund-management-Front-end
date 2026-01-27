import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ShipWheelIcon, Mail, Lock, ArrowLeft, AlertCircle, AlertTriangle, CheckCircle, Key, X } from "lucide-react";
import { useForgotPasswordMutation, useVerifyResetOtpMutation, useResetPasswordMutation } from '../../hooks/useAuthMutations';

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [signupData, setSignupData] = useState({
    email: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register, handleSubmit, formState: { errors: formErrors }, watch } = useForm();
  const otpRefs = useRef([]);

  const forgotPasswordMutation = useForgotPasswordMutation();
  const verifyResetOtpMutation = useVerifyResetOtpMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  // Loading states from mutations
  const loading = {
    sendingOtp: forgotPasswordMutation.isPending,
    verifyingOtp: verifyResetOtpMutation.isPending,
    resettingPassword: resetPasswordMutation.isPending,
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
    if (forgotPasswordMutation.error) {
      handleMutationError(forgotPasswordMutation.error, 'email');
    }
    if (verifyResetOtpMutation.error) {
      handleMutationError(verifyResetOtpMutation.error, 'otp');
    }
    if (resetPasswordMutation.error) {
      handleMutationError(resetPasswordMutation.error, 'password');
    }
  }, [forgotPasswordMutation.error, verifyResetOtpMutation.error, resetPasswordMutation.error]);

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
    if (errorMessage.includes("User not found") || errorMessage.includes("No account found")) {
      setErrors({ 
        email: "No account found with this email. Please check your email address.",
      });
    } else if (errorMessage.includes("Email is required")) {
      setErrors({ email: "Please enter your email address." });
    } else if (errorMessage.includes("OTP expired")) {
      setErrors({ [field]: "OTP has expired. Please request a new one." });
    } else if (errorMessage.includes("Invalid OTP") || errorMessage.includes("invalid")) {
      setErrors({ [field]: "Invalid OTP. Please check and try again." });
    } else if (errorMessage.includes("OTP not found")) {
      setErrors({ [field]: "OTP not found or already used. Please request a new one." });
    } else if (errorMessage.includes("Reset session expired") || errorMessage.includes("TokenExpiredError")) {
      setErrors({ 
        password: "Reset session expired. Please start the process again.",
        email: "Session expired. Please restart."
      });
      setOtpSent(false);
      setOtpVerified(false);
    } else if (errorMessage.includes("must be at least 6 characters")) {
      setErrors({ password: "Password must be at least 6 characters." });
    } else if (errorMessage.includes("Invalid reset token")) {
      setErrors({ 
        password: "Invalid reset session. Please start again.",
      });
      setOtpSent(false);
      setOtpVerified(false);
    } else {
      setErrors({ [field]: errorMessage });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!signupData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) newErrors.email = "Invalid email";
    
    const otpString = otp.join("");
    if (!otpString && otpSent) newErrors.otp = "OTP is required";
    if (otpString && otpString.length !== 6) newErrors.otp = "OTP must be 6 digits";
    return newErrors;
  };

  // EXACT OTP functions from SignUp
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

  // Send OTP - EXACTLY like SignUp
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    const emailError = !signupData.email.trim() ? "Email is required" : 
                       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email) ? "Invalid email" : "";
    
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});

    forgotPasswordMutation.mutate(signupData.email, {
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

  // Verify OTP - EXACTLY like SignUp
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

    verifyResetOtpMutation.mutate(
      { email: signupData.email, otp: otpString },
      {
        onSuccess: () => {
          setOtpVerified(true);
          setShowOtpPopup(false);
        },
        onError: (error) => {
          handleMutationError(error, 'otp');
        }
      }
    );
  };

  // Complete Password Reset
  const handleResetPassword = async (e) => {
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

    const formData = new FormData(e.target);
    const newPassword = formData.get('password');

    resetPasswordMutation.mutate(newPassword, {
      onSuccess: () => {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      },
      onError: (error) => {
        handleMutationError(error, 'password');
      }
    });
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
    
    forgotPasswordMutation.mutate(signupData.email, {
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

  const goBack = () => {
    if (!otpSent && !otpVerified) {
      navigate('/login');
    } else if (showOtpPopup) {
      setShowOtpPopup(false);
    } else {
      setOtpSent(false);
      setOtpVerified(false);
      setErrors({});
    }
  };

  const step = otpVerified ? 3 : otpSent ? 2 : 1;

  return (
    <>
      {/* OTP Verification Popup - EXACTLY like SignUp */}
      {showOtpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300 border border-base-300">
            <button
              onClick={closeOtpPopup}
              className="absolute right-4 top-4 btn btn-circle btn-ghost btn-sm hover:bg-base-300 transition-colors"
            >
              <X className="w-5 h-5 text-base-content/70" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm border border-primary/20">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-base-content">Reset Password OTP</h3>
              <p className="text-sm text-base-content/70 mt-2">
                Enter the 6-digit code sent to
                <br />
                <span className="font-semibold text-primary">{signupData.email}</span>
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
                      ${errors.otp ? 'border-error bg-error/10' : 'border-base-300'} 
                      ${digit ? 'border-primary bg-primary/10' : 'hover:border-base-400'}
                      focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none`}
                    disabled={loading.verifyingOtp}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {errors.otp && (
                <div className="text-center mb-4">
                  <span className="text-sm text-error flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.otp}
                  </span>
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                className={`btn btn-primary w-full h-11 ${loading.verifyingOtp ? 'loading' : ''}
                  ${otp.join("").length !== 6 ? 'btn-disabled' : ''}`}
                disabled={loading.verifyingOtp || otp.join("").length !== 6}
              >
                {loading.verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-base-content/70 mb-3">Didn't receive the code?</p>
              <button
                onClick={resendOtp}
                className={`btn btn-ghost btn-sm ${loading.sendingOtp ? 'loading' : ''}
                  ${resendTimer > 0 ? 'btn-disabled' : ''}`}
                disabled={resendTimer > 0 || loading.sendingOtp}
              >
                {loading.sendingOtp ? "Sending..." : 
                 resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 
                 "Resend OTP"}
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-base-300">
              <p className="text-xs text-base-content/50 text-center">The OTP will expire in 5 minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Forgot Password Form */}
      <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-base-100 via-base-50 to-base-100">
        <div className="w-full max-w-lg bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
          <div className="p-7">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                    <ShipWheelIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-base-content">Society Fund</h1>
                    <p className="text-sm text-base-content/70">Secure Fund Management</p>
                  </div>
                </div>
                
                <button
                  onClick={goBack}
                  className="btn btn-ghost btn-sm btn-circle hover:bg-base-300 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-base-content">
                    {step === 1 && 'Reset Password'}
                    {step === 2 && 'Verify Identity'}
                    {step === 3 && 'New Password'}
                  </h2>
                  <p className="text-base-content/70 text-sm mt-1">
                    {step === 1 && 'Enter your email to receive a reset OTP'}
                    {step === 2 && 'OTP sent to your email'}
                    {step === 3 && 'Create a new password for your account'}
                  </p>
                </div>
                
                {/* Step Indicator */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((stepNum) => (
                    <div
                      key={stepNum}
                      className={`w-8 h-1 rounded-full transition-all duration-300 ${
                        stepNum === step
                          ? 'bg-primary'
                          : stepNum < step
                          ? 'bg-success'
                          : 'bg-base-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Step 1: Email Input - EXACTLY like SignUp */}
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(e); }} className="space-y-6">
                <div className="form-control">
                  <div className="flex items-center justify-between mb-2">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Email Address</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {otpSent && !otpVerified && !loading.sendingOtp && (
                        <span className="badge badge-info gap-1">
                          <div className="w-2 h-2 rounded-full bg-base-100"></div>
                          OTP Sent
                        </span>
                      )}
                      {otpVerified && (
                        <span className="badge badge-success gap-1">
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
                        <Mail className={`w-5 h-5 ${
                          loading.sendingOtp ? 'text-primary animate-pulse' : 'text-base-content/40'
                        }`} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className={`input input-bordered w-full pl-11 h-11 ${errors.email ? 'input-error' : ''}`}
                        value={signupData.email}
                        onChange={handleChange}
                        required
                        disabled={otpSent || loading.sendingOtp}
                        autoFocus
                      />
                    </div>
                    
                    {!otpVerified && (
                      <button
                        type="submit"
                        className={`btn h-11 ${otpSent ? 'btn-outline' : 'btn-primary'} ${loading.sendingOtp ? 'loading' : ''}`}
                        disabled={loading.sendingOtp || otpSent}
                      >
                        {loading.sendingOtp ? "Sending..." : otpSent ? "Sent ✓" : "Send OTP"}
                      </button>
                    )}
                  </div>
                  
                  {otpSent && !otpVerified && !loading.sendingOtp && (
                    <div className="mt-3 p-3 bg-info/10 rounded-lg border border-info/20">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-info/20 rounded-full">
                          <Mail className="w-4 h-4 text-info" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-info-content">
                            <span className="font-semibold">OTP sent!</span> Check your email.
                            <button 
                              onClick={() => setShowOtpPopup(true)}
                              className="link link-info font-semibold ml-1"
                            >
                              Click to enter OTP
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {errors.email && (
                    <div className="mt-2 flex items-center gap-1 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>
              </form>
            )}

            {/* Step 2: OTP Verification Status */}
            {step === 2 && !showOtpPopup && (
              <div className="space-y-6">
                <div className="p-4 bg-info/10 rounded-lg border border-info/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-info/20 rounded-full">
                      <Key className="w-5 h-5 text-info" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-info-content">
                        <span className="font-semibold">OTP sent to {signupData.email}</span>
                        <br />
                        Check your email for the 6-digit verification code.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowOtpPopup(true)}
                    className="btn btn-primary w-full h-11"
                  >
                    Enter OTP
                  </button>
                  
                  <button
                    onClick={resendOtp}
                    className={`btn btn-ghost btn-sm mt-4 ${loading.sendingOtp ? 'loading' : ''}
                      ${resendTimer > 0 ? 'btn-disabled' : ''}`}
                    disabled={resendTimer > 0 || loading.sendingOtp}
                  >
                    {loading.sendingOtp ? "Sending..." : 
                     resendTimer > 0 ? `Resend in ${resendTimer}s` : 
                     "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-5">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">New Password</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-base-content/40" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter new password"
                        className={`input input-bordered w-full pl-11 h-11 ${errors.password ? 'input-error' : ''}`}
                        required
                        minLength={6}
                        disabled={loading.resettingPassword}
                        autoFocus
                      />
                    </div>
                    {errors.password && (
                      <div className="mt-2 flex items-center gap-1 text-error text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-base-content">Confirm Password</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-5 h-5 text-base-content/40" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        className={`input input-bordered w-full pl-11 h-11 ${errors.confirmPassword ? 'input-error' : ''}`}
                        required
                        disabled={loading.resettingPassword}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div className="mt-2 flex items-center gap-1 text-error text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <div className={`alert alert-error shadow-sm`}>
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">{errors.submit}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className={`btn btn-primary w-full h-11 ${loading.resettingPassword ? 'loading' : ''}`}
                  disabled={loading.resettingPassword}
                >
                  {loading.resettingPassword ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* Success Message */}
            {step === 3 && resetPasswordMutation.isSuccess && (
              <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20 animate-in fade-in duration-500">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <div className="flex-1">
                    <p className="font-medium text-success text-sm">
                      Password reset successful!
                    </p>
                    <p className="text-success/70 text-xs mt-1">
                      Redirecting to login page in 2 seconds...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="mt-8 pt-6 border-t border-base-300">
              <div className="text-center">
                <p className="text-sm text-base-content/70">
                  Remember your password?{" "}
                  <Link to="/login" className="link link-primary font-semibold">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;