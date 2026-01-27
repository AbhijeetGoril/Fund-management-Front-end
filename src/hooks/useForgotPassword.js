// hooks/useForgotPassword.js
import { useState } from 'react';

export const useForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  
  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const goToStep = (stepNumber) => setStep(stepNumber);
  
  return {
    step,
    setStep,
    email,
    setEmail,
    isResendingOtp,
    setIsResendingOtp,
    nextStep,
    prevStep,
    goToStep
  };
};