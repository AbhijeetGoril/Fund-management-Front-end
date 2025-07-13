import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // You can create this page next
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Signup/>} />
        <Route path="/dashboared" element={<Dashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
