// components/SignUp.jsx
import { ShipWheelIcon, Mail, Key, Lock, User, AlertCircle, AlertTriangle, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthMutations } from "../../hooks/useAuthMutations";

const SignUp = () => {
  const navigate = useNavigate();
  const {
    sendOtpMutation,
    verifyOtpMutation,
    setPasswordMutation,
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

  // Derived loading states from mutations
  const loading = {
    sendingOtp: sendOtpMutation.isPending,
    verifyingOtp: verifyOtpMutation.isPending,
    settingPassword: setPasswordMutation.isPending,
  };

  useEffect(() => {
    // Initialize refs array
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
    if (sendOtpMutation.error) {
      handleMutationError(sendOtpMutation.error, 'email');
    }
    if (verifyOtpMutation.error) {
      handleMutationError(verifyOtpMutation.error, 'otp');
    }
    if (setPasswordMutation.error) {
      handleMutationError(setPasswordMutation.error, 'submit');
    }
  }, [sendOtpMutation.error, verifyOtpMutation.error, setPasswordMutation.error]);

  const handleMutationError = (error, field) => {
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    
    if (errorMessage.includes("already verified")) {
      setErrors({ 
        email: "Email already verified. Please login.",
      });
    } else if (errorMessage.includes("not found") || errorMessage.includes("expired")) {
      setErrors({ [field]: "OTP not found or expired. Please request a new one." });
    } else if (errorMessage.includes("Invalid OTP")) {
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
    } else {
      setErrors({ [field]: errorMessage });
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

  // Send OTP using React Query mutation
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    const emailError = !signupData.email.trim() ? "Email is required" : 
                       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email) ? "Invalid email" : "";
    
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    setErrors({});

    sendOtpMutation.mutate(signupData.email, {
      onSuccess: (data) => {
        setOtpSent(true);
        setResendTimer(60);
        setOtp(["", "", "", "", "", ""]);
      },
      onError: (error) => {
        // Error handled in useEffect
      }
    });
  };

  // Verify OTP using React Query mutation
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

    verifyOtpMutation.mutate(
      { email: signupData.email, otp: otpString },
      {
        onSuccess: (data) => {
          setSignupToken(data.signupToken);
          setOtpVerified(true);
          setShowOtpPopup(false);
        },
        onError: (error) => {
          // Error handled in useEffect
        }
      }
    );
  };

  // Complete Signup using React Query mutation
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

    setPasswordMutation.mutate(
      { 
        ...signupData,
        signupToken 
      },
      {
        onSuccess: (data) => {
          navigate("/login");
        },
        onError: (error) => {
          // Error handled in useEffect
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
    
    sendOtpMutation.mutate(signupData.email, {
      onSuccess: () => {
        otpRefs.current[0]?.focus();
      },
      onError: (error) => {
        setErrors({ otp: error.response?.data?.message || "Failed to resend OTP" });
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
          <div className="relative w-full max-w-md bg-base-100 rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-300">
            {/* Close Button */}
            <button
              onClick={closeOtpPopup}
              className="absolute right-4 top-4 btn btn-circle btn-ghost btn-sm"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Popup Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Key className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Verify Your Email</h3>
              <p className="text-sm opacity-70 mt-2">
                Enter the 6-digit code sent to
                <br />
                <span className="font-medium text-primary">{signupData.email}</span>
              </p>
            </div>

            {/* OTP Input Boxes */}
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
                    className={`input input-bordered w-14 h-14 text-center text-2xl font-bold transition-all ${
                      errors.otp ? 'input-error' : ''
                    } ${digit ? 'border-primary ring-2 ring-primary/20' : ''}`}
                    disabled={loading.verifyingOtp}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* OTP Error Message */}
              {errors.otp && (
                <div className="text-center mb-4">
                  <span className="label-text-alt text-error">{errors.otp}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                className={`btn btn-primary w-full ${loading.verifyingOtp ? "loading" : ""}`}
                disabled={loading.verifyingOtp || otp.join("").length !== 6}
              >
                {loading.verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            {/* Resend OTP Section */}
            <div className="text-center">
              <p className="text-sm opacity-70 mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={resendOtp}
                className={`btn btn-ghost btn-sm ${
                  resendTimer > 0 || loading.sendingOtp ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={resendTimer > 0 || loading.sendingOtp}
              >
                {loading.sendingOtp ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Sending...
                  </>
                ) : resendTimer > 0 ? (
                  `Resend OTP in ${resendTimer}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </div>

            {/* Popup Footer */}
            <div className="mt-6 pt-4 border-t border-base-300">
              <p className="text-xs opacity-50 text-center">
                The OTP will expire in 10 minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Signup Form */}
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-base-100 via-base-100 to-base-200">
        <div className="border border-primary/20 flex w-full max-w-5xl mx-auto bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
          {/* Left side form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col">
            <div className="mb-8 flex items-center justify-start gap-3">
              <ShipWheelIcon className="w-10 h-10 text-primary" />
              <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                Society Fund
              </span>
            </div>

            <form onSubmit={handleSignUp} className="w-full space-y-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">Create an Account</h2>
                <p className="text-sm opacity-70 mt-2">
                  Join Society Fund Management and start managing your funds securely
                </p>
              </div>

              {/* Full Name */}
              <div className="form-control w-full">
                <label className="label mb-1">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    className={`input input-bordered w-full pl-10 h-12 ${errors.fullName ? 'input-error' : ''}`}
                    value={signupData.fullName}
                    onChange={handleChange}
                    required
                    disabled={otpVerified}
                  />
                </div>
                {errors.fullName && (
                  <div className="mt-1">
                    <span className="label-text-alt text-error">{errors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Email with OTP */}
              <div className="form-control w-full">
                <label className="label mb-1">
                  <span className="label-text font-medium">Email</span>
                  {otpSent && !otpVerified && (
                    <span className="label-text-alt text-blue-500 font-medium">
                      ✓ OTP Sent
                    </span>
                  )}
                  {otpVerified && (
                    <span className="label-text-alt text-green-500 font-medium">
                      ✓ Verified
                    </span>
                  )}
                </label>
                <div className="flex flex-col sm:flex-row gap-3 mb-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="example@gmail.com"
                      className={`input input-bordered w-full pl-10 h-12 ${errors.email ? 'input-error' : ''}`}
                      value={signupData.email}
                      onChange={handleChange}
                      required
                      disabled={otpSent}
                    />
                  </div>
                  {!otpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className={`btn h-12 min-h-12 ${otpSent ? 'btn-outline' : 'btn-primary'} ${loading.sendingOtp ? "loading" : ""}`}
                      disabled={loading.sendingOtp || otpSent}
                    >
                      {loading.sendingOtp ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
                    </button>
                  )}
                </div>
                
                {/* OTP Status Display */}
                {otpSent && !otpVerified && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700">
                      <strong>OTP sent!</strong> Check your email for the verification code.
                      <button 
                        onClick={() => setShowOtpPopup(true)}
                        className="link link-primary ml-2"
                      >
                        Enter OTP here
                      </button>
                    </p>
                  </div>
                )}
                
                {errors.email && (
                  <div className="mt-1">
                    <span className="label-text-alt text-error">{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="form-control w-full">
                <label className="label mb-1">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-10 h-12 ${errors.password ? 'input-error' : ''}`}
                    value={signupData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    disabled={!otpVerified}
                  />
                </div>
                <div className="mt-1">
                  <span className="label-text-alt opacity-70">Minimum 6 characters</span>
                  {errors.password && (
                    <span className="label-text-alt text-error ml-3">{errors.password}</span>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="form-control mt-4">
                <label className="label cursor-pointer justify-start gap-3 p-0">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm checkbox-primary" 
                    required 
                    disabled={!otpVerified}
                  />
                  <span className="label-text text-sm">
                    I agree to the <a href="#" className="link link-primary">Terms</a> and <a href="#" className="link link-primary">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className={`btn btn-primary w-full h-12 min-h-12 mt-2 ${loading.settingPassword ? "loading" : ""}`} 
                disabled={loading.settingPassword || !otpVerified}
              >
                {loading.settingPassword ? "Creating Account..." : "Create Account"}
              </button>

              {/* Error Message */}
              {errors.submit && (
                <div className={`alert mt-4 ${errors.submit.includes("expired") || errors.submit.includes("restart") ? 'alert-error' : 'alert-warning'}`}>
                  {errors.submit.includes("expired") || errors.submit.includes("restart") ? (
                    <AlertCircle className="h-5 w-5 stroke-current flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 stroke-current flex-shrink-0" />
                  )}
                  <span className="text-sm">{errors.submit}</span>
                </div>
              )}

              {/* Login Link */}
              <div className="text-center pt-6">
                <span className="text-sm opacity-70">
                  Already have an account?{" "}
                  <Link to="/login" className="link link-primary font-semibold">Sign In</Link>
                </span>
              </div>
            </form>
          </div>

          {/* Right side Image */}
          <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 p-8">
            <div className="text-center max-w-md mx-auto">
              <img 
                src="/House_searching-pana.png" 
                alt="Financial management illustration" 
                className="w-full max-w-md object-contain mb-6 mx-auto" 
              />
              <h3 className="text-2xl font-bold mb-4">Secure Fund Management</h3>
              <p className="text-base opacity-80 mb-6">
                Join thousands of society members who are efficiently managing their funds with our secure platform.
              </p>
              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-sm opacity-80 text-left">
                  <strong className="text-primary">Note:</strong> After entering email, click "Send OTP" to receive verification code. 
                  Verify OTP before setting your password.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;