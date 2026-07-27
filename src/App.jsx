import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard"; // You can create this page next
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/auth/SignUp";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import SocietyDetails from "./pages/SocietyDetails";
import EventSpends from "./pages/EventSpends";
import { useSelector } from "react-redux";
import { getToken } from "./utils/getToken";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotificationsPage from "./pages/NotificationsPage";

function App() {
  const  token=async()=>{
    const token = await getToken();
    console.log("TOKEN:", token);
  }
  token()
  const theme = useSelector((state) => state.theme.theme);
  
  return (
    <BrowserRouter>
      <div className="h-screen" data-theme={theme}>
         <Routes>
        <Route path="/" element={<Home/> }/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/events/:eventId/spends" element={<EventSpends />} />
        <Route path="/society/:id" element={<SocietyDetails />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
      </div>
     
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
