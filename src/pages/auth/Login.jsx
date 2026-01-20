import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      toast.success("Login with Google successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google login failed: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-200 mt-4 flex items-center justify-center gap-2"
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
