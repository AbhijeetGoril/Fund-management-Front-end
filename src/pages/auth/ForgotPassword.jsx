import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { ShipWheelIcon, Mail, Lock, ArrowLeft, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { useForgotPasswordMutation, useVerifyResetOtpMutation, useResetPasswordMutation } from '../../hooks/useAuthMutations';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  
  const forgotPasswordMutation = useForgotPasswordMutation();
  const verifyResetOtpMutation = useVerifyResetOtpMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  // Timer for resend OTP
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = async (data) => {
    const result = await forgotPasswordMutation.mutateAsync(data.email);
    if (!result?.fieldErrors) {
      setEmail(data.email);
      setStep(2);
      setOtpSentTime(new Date());
      setResendCooldown(60); // 60 seconds cooldown
    }
  };
  
  const handleOtpSubmit = async (data) => {
    const result = await verifyResetOtpMutation.mutateAsync({
      email,
      otp: data.otp
    });
    if (!result?.fieldErrors) {
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
    if (resendCooldown > 0) return;
    
    setIsResending(true);
    const result = await forgotPasswordMutation.mutateAsync(email);
    if (!result?.fieldErrors) {
      setOtpSentTime(new Date());
      setResendCooldown(60);
    }
    setIsResending(false);
  };

  const goBack = () => {
    if (step === 1) {
      navigate('/login');
    } else {
      setStep(step - 1);
    }
  };

  return (
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
                className="btn btn-ghost btn-sm btn-circle"
                type="button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-base-content">
                  {step === 1 && 'Reset Password'}
                  {step === 2 && 'Verify OTP'}
                  {step === 3 && 'Set New Password'}
                </h2>
                <p className="text-base-content/70 text-sm mt-1">
                  {step === 1 && 'Enter your email to receive a reset OTP'}
                  {step === 2 && `Enter the 6-digit OTP sent to ${email}`}
                  {step === 3 && 'Create a new password for your account'}
                </p>
              </div>
              
              {/* Step Indicator */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((stepNum) => (
                  <div
                    key={stepNum}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      stepNum === step
                        ? 'bg-primary w-4'
                        : stepNum < step
                        ? 'bg-success'
                        : 'bg-base-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-base-200 rounded-full h-1 mb-6">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Forms */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-base-content/40" />
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
                      errors.email || forgotPasswordMutation.error?.fieldErrors?.email ? 'input-error' : ''
                    }`}
                    disabled={forgotPasswordMutation.isPending}
                  />
                </div>
                {(errors.email || forgotPasswordMutation.error?.fieldErrors?.email) && (
                  <div className="mt-2 flex items-center gap-1 text-error text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email?.message || forgotPasswordMutation.error?.fieldErrors?.email}
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

          {step === 2 && (
            <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-base-content">6-digit OTP</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    maxLength="6"
                    {...register('otp', { 
                      required: 'OTP is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'OTP must be 6 digits'
                      }
                    })}
                    placeholder="Enter 6-digit code"
                    className={`input input-bordered w-full pl-11 h-11 text-center text-lg tracking-widest ${
                      errors.otp || verifyResetOtpMutation.error?.fieldErrors?.otp ? 'input-error' : ''
                    }`}
                    disabled={verifyResetOtpMutation.isPending}
                  />
                </div>
                {(errors.otp || verifyResetOtpMutation.error?.fieldErrors?.otp) && (
                  <div className="mt-2 flex items-center gap-1 text-error text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.otp?.message || verifyResetOtpMutation.error?.fieldErrors?.otp}
                  </div>
                )}
                
                {/* OTP Timer and Resend */}
                <div className="mt-4 flex items-center justify-between">
                  {otpSentTime && (
                    <div className="text-sm text-base-content/70">
                      OTP sent at {otpSentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isResending}
                    className={`text-sm font-medium ${
                      resendCooldown > 0
                        ? 'text-base-content/50 cursor-not-allowed'
                        : 'link link-primary'
                    }`}
                  >
                    {isResending ? 'Sending...' : 
                     resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 
                     'Resend OTP'}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary w-full h-11 ${verifyResetOtpMutation.isPending ? 'loading' : ''}`}
                disabled={verifyResetOtpMutation.isPending}
              >
                {verifyResetOtpMutation.isPending ? 'Verifying...' : 'Verify OTP & Continue'}
              </button>
            </form>
          )}

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
                        errors.password ? 'input-error' : ''
                      }`}
                      disabled={resetPasswordMutation.isPending}
                    />
                  </div>
                  {errors.password && (
                    <div className="mt-2 flex items-center gap-1 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password.message}
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
                        errors.confirmPassword ? 'input-error' : ''
                      }`}
                      disabled={resetPasswordMutation.isPending}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="mt-2 flex items-center gap-1 text-error text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-base-200/50 rounded-lg border border-base-300">
                <h4 className="font-semibold text-base-content text-sm mb-2">Password Requirements:</h4>
                <ul className="text-xs text-base-content/70 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${watch('password')?.length >= 6 ? 'bg-success' : 'bg-base-300'}`} />
                    At least 6 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${watch('password') && watch('confirmPassword') && watch('password') === watch('confirmPassword') ? 'bg-success' : 'bg-base-300'}`} />
                    Passwords must match
                  </li>
                </ul>
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary w-full h-11 ${resetPasswordMutation.isPending ? 'loading' : ''}`}
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Success Message for Step 3 */}
          {step === 3 && resetPasswordMutation.isSuccess && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="font-medium text-success text-sm">
                    Password reset successful!
                  </p>
                  <p className="text-success/70 text-xs mt-1">
                    Redirecting to login page...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {(forgotPasswordMutation.error?.generalError || 
            verifyResetOtpMutation.error?.generalError || 
            resetPasswordMutation.error?.generalError) && (
            <div className={`mt-6 alert shadow-sm ${
              forgotPasswordMutation.error?.generalError?.includes('expired') ||
              verifyResetOtpMutation.error?.generalError?.includes('expired') ||
              resetPasswordMutation.error?.generalError?.includes('expired') ||
              resetPasswordMutation.error?.generalError?.includes('restart')
                ? 'alert-error'
                : 'alert-warning'
            }`}>
              {forgotPasswordMutation.error?.generalError?.includes('expired') ||
               verifyResetOtpMutation.error?.generalError?.includes('expired') ||
               resetPasswordMutation.error?.generalError?.includes('expired') ||
               resetPasswordMutation.error?.generalError?.includes('restart') ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {forgotPasswordMutation.error?.generalError ||
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;