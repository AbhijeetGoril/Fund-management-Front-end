import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ShipWheelIcon, Mail, Lock, ArrowLeft, AlertCircle, AlertTriangle, CheckCircle, Key, Clock, X } from "lucide-react";
import { useForgotPasswordMutation, useVerifyResetOtpMutation, useResetPasswordMutation } from '../../hooks/useAuthMutations';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register, handleSubmit, formState: { errors: formErrors }, watch, reset } = useForm();
  const otpRefs = useRef([]);
  
  const forgotPasswordMutation = useForgotPasswordMutation();
  const verifyResetOtpMutation = useVerifyResetOtpMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  // Handle mutation errors
  useEffect(() => {
    if (forgotPasswordMutation.error) {
      handleMutationError(forgotPasswordMutation.error, 'email', 'forgot');
    }
    if (verifyResetOtpMutation.error) {
      handleMutationError(verifyResetOtpMutation.error, 'otp', 'verify');
    }
    if (resetPasswordMutation.error) {
      handleMutationError(resetPasswordMutation.error, 'password', 'reset');
    }
  }, [forgotPasswordMutation.error, verifyResetOtpMutation.error, resetPasswordMutation.error]);

  const handleMutationError = (error, field, type) => {
    let errorMessage = "An error occurred";
    
    // Extract error message
    if (error.fieldErrors?.[field]) {
      errorMessage = error.fieldErrors[field];
    } else if (error.generalError) {
      errorMessage = error.generalError;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
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
      setErrors({ 
        otp: "OTP has expired. Please request a new one.",
        timer: "expired"
      });
      setResendTimer(0);
    } else if (errorMessage.includes("Invalid OTP")) {
      setErrors({ otp: "Invalid OTP. Please check and try again." });
    } else if (errorMessage.includes("OTP not found")) {
      setErrors({ otp: "OTP not found or already used. Please request a new one." });
    } else if (errorMessage.includes("Email and OTP are required")) {
      setErrors({ 
        email: "Email is required",
        otp: "OTP is required" 
      });
    } else if (errorMessage.includes("Reset session expired") || errorMessage.includes("TokenExpiredError")) {
      setErrors({ 
        password: "Reset session expired. Please start the process again.",
        session: "expired"
      });
      resetAll();
    } else if (errorMessage.includes("must be at least 6 characters")) {
      setErrors({ password: "Password must be at least 6 characters." });
    } else if (errorMessage.includes("Invalid reset token")) {
      setErrors({ 
        password: "Invalid reset session. Please start again.",
        session: "invalid"
      });
      resetAll();
    } else {
      setErrors({ [field]: errorMessage });
    }
  };

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Focus first OTP input when popup opens
  useEffect(() => {
    if (showOtpPopup) {
      setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);
    }
  }, [showOtpPopup]);

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
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

  const handleEmailSubmit = async (data) => {
    setErrors({});
    
    const result = await forgotPasswordMutation.mutateAsync(data.email);
    if (!result?.fieldErrors) {
      setEmail(data.email);
      setOtpSentTime(new Date());
      setResendTimer(60);
      setShowOtpPopup(true);
      setStep(2);
    }
  };
  
  const handleOtpSubmit = async () => {
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

    const result = await verifyResetOtpMutation.mutateAsync({
      email,
      otp: otpString
    });
    
    if (!result?.fieldErrors) {
      setShowOtpPopup(false);
      setStep(3);
    }
  };
  
  const handlePasswordSubmit = async (data) => {
    const result = await resetPasswordMutation.mutateAsync(data.password);
    if (!result?.fieldErrors) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setErrors({});
    setOtp(['', '', '', '', '', '']);
    
    const result = await forgotPasswordMutation.mutateAsync(email);
    if (!result?.fieldErrors) {
      setOtpSentTime(new Date());
      setResendTimer(60);
      otpRefs.current[0]?.focus();
    }
  };

  const resetAll = () => {
    setStep(1);
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setShowOtpPopup(false);
    setErrors({});
    reset();
  };

  const goBack = () => {
    if (step === 1) {
      navigate('/login');
    } else if (step === 2 && showOtpPopup) {
      setShowOtpPopup(false);
    } else {
      setStep(step - 1);
      setErrors({});
    }
  };

  // OTP Popup Component
  const OtpPopup = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300 border border-base-300">
        <button
          onClick={() => {
            setShowOtpPopup(false);
            setErrors({});
          }}
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
            <span className="font-semibold text-primary">{email}</span>
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
                disabled={verifyResetOtpMutation.isPending}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {errors.otp && (
            <div className={`text-center mb-4 p-3 rounded-lg ${
              errors.otp.includes('expired') ? 'bg-error/10 border border-error/20' : 'bg-warning/10 border border-warning/20'
            }`}>
              <span className={`text-sm flex items-center justify-center gap-1 ${
                errors.otp.includes('expired') ? 'text-error' : 'text-warning'
              }`}>
                <AlertCircle className="w-4 h-4" />
                {errors.otp}
              </span>
            </div>
          )}

          <button
            onClick={handleOtpSubmit}
            className={`btn btn-primary w-full h-11 ${verifyResetOtpMutation.isPending ? 'loading' : ''}
              ${otp.join("").length !== 6 ? 'btn-disabled' : ''}`}
            disabled={verifyResetOtpMutation.isPending || otp.join("").length !== 6}
          >
            {verifyResetOtpMutation.isPending ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-base-content/70 mb-3">Didn't receive the code?</p>
          <button
            onClick={handleResendOtp}
            className={`btn btn-ghost btn-sm ${forgotPasswordMutation.isPending ? 'loading' : ''}
              ${resendTimer > 0 ? 'btn-disabled' : ''}`}
            disabled={resendTimer > 0 || forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? "Sending..." : 
             resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 
             "Resend OTP"}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-base-300">
          <div className="flex items-center justify-center gap-2 text-sm text-base-content/50">
            <Clock className="w-4 h-4" />
            <span>OTP valid for 5 minutes</span>
          </div>
          {otpSentTime && (
            <p className="text-xs text-base-content/40 text-center mt-2">
              Sent at {otpSentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* OTP Verification Popup */}
      {showOtpPopup && <OtpPopup />}

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
                  type="button"
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

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-base-content">Email Address</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 ${
                        forgotPasswordMutation.isPending ? 'text-primary animate-pulse' : 'text-base-content/40'
                      }`} />
                    </div>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      placeholder="you@example.com"
                      className={`input input-bordered w-full pl-11 h-11 ${
                        errors.email || formErrors.email ? 'input-error' : ''
                      }`}
                      disabled={forgotPasswordMutation.isPending}
                    />
                  </div>
                  {(errors.email || formErrors.email) && (
                    <div className="mt-2 flex items-center gap-1 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email || formErrors.email?.message}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-primary w-full h-11 ${forgotPasswordMutation.isPending ? 'loading' : ''}`}
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? 'Sending OTP...' : 'Send Reset OTP'}
                </button>
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
                        <span className="font-semibold">OTP sent to {email}</span>
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
                    onClick={handleResendOtp}
                    className={`btn btn-ghost btn-sm mt-4 ${forgotPasswordMutation.isPending ? 'loading' : ''}
                      ${resendTimer > 0 ? 'btn-disabled' : ''}`}
                    disabled={resendTimer > 0 || forgotPasswordMutation.isPending}
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : 
                     resendTimer > 0 ? `Resend in ${resendTimer}s` : 
                     "Resend OTP"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-6">
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
                        {...register('password', { 
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        placeholder="Enter new password"
                        className={`input input-bordered w-full pl-11 h-11 ${
                          errors.password || formErrors.password ? 'input-error' : ''
                        }`}
                        disabled={resetPasswordMutation.isPending}
                      />
                    </div>
                    {(errors.password || formErrors.password) && (
                      <div className="mt-2 flex items-center gap-1 text-error text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password || formErrors.password?.message}
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
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: value => 
                            value === watch('password') || 'Passwords do not match'
                        })}
                        placeholder="Confirm new password"
                        className={`input input-bordered w-full pl-11 h-11 ${
                          errors.confirmPassword || formErrors.confirmPassword ? 'input-error' : ''
                        }`}
                        disabled={resetPasswordMutation.isPending}
                      />
                    </div>
                    {(errors.confirmPassword || formErrors.confirmPassword) && (
                      <div className="mt-2 flex items-center gap-1 text-error text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.confirmPassword || formErrors.confirmPassword?.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-4 bg-base-200/50 rounded-lg border border-base-300">
                  <h4 className="font-semibold text-base-content text-sm mb-2">Password Requirements:</h4>
                  <ul className="text-xs text-base-content/70 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        watch('password')?.length >= 6 ? 'bg-success' : 'bg-base-300'
                      }`} />
                      At least 6 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        watch('password') && watch('confirmPassword') && 
                        watch('password') === watch('confirmPassword') ? 'bg-success' : 'bg-base-300'
                      }`} />
                      Passwords must match
                    </li>
                  </ul>
                </div>

                {/* Session expired warning */}
                {(errors.session === 'expired' || errors.session === 'invalid') && (
                  <div className="alert alert-error shadow-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {errors.password}
                      <button 
                        onClick={resetAll}
                        className="link link-primary font-semibold ml-2"
                      >
                        Click here to restart
                      </button>
                    </span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className={`btn btn-primary w-full h-11 ${resetPasswordMutation.isPending ? 'loading' : ''}`}
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? 'Updating...' : 'Reset Password'}
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

            {/* General Error Messages */}
            {(errors.generalError || 
              forgotPasswordMutation.error?.generalError || 
              verifyResetOtpMutation.error?.generalError || 
              resetPasswordMutation.error?.generalError) && (
              <div className={`mt-6 alert shadow-sm ${
                errors.generalError?.includes('expired') ||
                forgotPasswordMutation.error?.generalError?.includes('expired') ||
                verifyResetOtpMutation.error?.generalError?.includes('expired') ||
                resetPasswordMutation.error?.generalError?.includes('expired') ||
                errors.generalError?.includes('restart') ||
                resetPasswordMutation.error?.generalError?.includes('restart')
                  ? 'alert-error'
                  : 'alert-warning'
              }`}>
                {errors.generalError?.includes('expired') ||
                 forgotPasswordMutation.error?.generalError?.includes('expired') ||
                 verifyResetOtpMutation.error?.generalError?.includes('expired') ||
                 resetPasswordMutation.error?.generalError?.includes('expired') ||
                 errors.generalError?.includes('restart') ||
                 resetPasswordMutation.error?.generalError?.includes('restart') ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {errors.generalError ||
                   forgotPasswordMutation.error?.generalError ||
                   verifyResetOtpMutation.error?.generalError ||
                   resetPasswordMutation.error?.generalError}
                </span>
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
                {step === 1 && (
                  <p className="text-sm text-base-content/50 mt-2">
                    Need help? Contact support at support@societyfund.com
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;