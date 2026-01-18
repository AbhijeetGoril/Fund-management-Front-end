import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Signup = () => {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [signupToken, setSignupToken] = useState("");

  // 1️⃣ SEND OTP
  const sendOtp = async () => {
    const res = await fetch("http://localhost:3000/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("OTP sent to email");
      setStep(2);
    } else {
      alert(data.message);
    }
  };

  // 2️⃣ VERIFY OTP
  const verifyOtp = async () => {
    const res = await fetch("http://localhost:3000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (res.ok) {
      setSignupToken(data.signupToken);
      setStep(3);
    } else {
      alert(data.message);
    }
  };

  // 3️⃣ SET PASSWORD
  const submitPassword = async () => {
    const res = await fetch("http://localhost:3000/api/auth/set-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${signupToken}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Signup complete. Please login.");
      window.location.href = "/login";
    } else {
      alert(data.message);
    }
  };

  // 🔵 GOOGLE SIGNUP
  const signupWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseToken = await result.user.getIdToken();
    console.log(firebaseToken)
    const res = await fetch("http://localhost:3000/api/auth/google", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
      credentials: "include", // 🔐 cookie
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert("Google signup failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <h2>Signup</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="Set Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={submitPassword}>Complete Signup</button>
        </>
      )}

      <hr />

      <button onClick={signupWithGoogle}>Signup with Google</button>
    </div>
  );
};

export default Signup;
