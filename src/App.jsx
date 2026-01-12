import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; // You can create this page next
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/SignUp";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import EventDetails from "./pages/EventDetails";
import SocietyDetails from "./pages/SocietyDetails";
import EventSpends from "./pages/EventSpends";
import { useSelector } from "react-redux";
import { getToken } from "./utils/getToken";

function App() {
  const theme = useSelector((state) => state.theme.theme);
  console.log(getToken())
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
        <Route path="/society/:id" element={<SocietyDetails />} />
        <Route path="/events/:eventId/spends" element={<EventSpends />} />
      </Routes>
      </div>
     
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
