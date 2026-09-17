import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import EventDetails from "./pages/EventDetails";
import SocietyDetails from "./pages/SocietyDetails";
import EventSpends from "./pages/EventSpends";
import MemberDetails from "./pages/Memberdetails";
import NotificationsPage from "./pages/NotificationsPage";
import Discover from "./pages/Discover";
import ChatPage from "./pages/ChatPage";

import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSelector } from "react-redux";
import { useSocketConnection } from "./hooks/useSocketConnection";

function App() {
  useSocketConnection();

  const theme = useSelector(
    (state) => state.theme.theme
  );

  return (
    <BrowserRouter>
      <div
        className="h-screen"
        data-theme={theme}
      >
        <Routes>

          {/* ========================================
              PUBLIC ROUTES
          ======================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />


          {/* ========================================
              PROTECTED ROUTES
          ======================================== */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/admin-panel"
              element={<AdminPanel />}
            />

            <Route
              path="/events/:eventId"
              element={<EventDetails />}
            />

            <Route
              path="/events/:eventId/spends"
              element={<EventSpends />}
            />

            <Route
              path="/events/:eventId/members/:memberId"
              element={<MemberDetails />}
            />

            <Route
              path="/society/:societyId"
              element={<SocietyDetails />}
            />

            <Route
              path="/notifications"
              element={<NotificationsPage />}
            />

            <Route
              path="/discover"
              element={<Discover />}
            />

            <Route
              path="/chat"
              element={<ChatPage />}
            />

          </Route>

        </Routes>
      </div>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;