import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Preschool from "@/pages/Preschool";
import Recreational from "@/pages/Recreational";
import Competitive from "@/pages/Competitive";
import Cheer from "@/pages/Cheer";
import Camps from "@/pages/Camps";
import SpecialEvents from "@/pages/SpecialEvents";
import CalendarPage from "@/pages/CalendarPage";
import BirthdayParties from "@/pages/BirthdayParties";
import CollegeRecruits from "@/pages/CollegeRecruits";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import Baseball from "@/pages/Baseball";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ParentDashboard from "@/pages/ParentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Protected = ({ children, admin = false }) => {
  const { user, checked } = useAuth();
  if (!checked || user === null)
    return <div className="min-h-screen bg-ink flex items-center justify-center text-lime font-display text-2xl">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AnalyticsTracker />
          <Toaster position="top-right" theme="dark" richColors />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/preschool" element={<Preschool />} />
              <Route path="/recreational" element={<Recreational />} />
              <Route path="/competitive" element={<Competitive />} />
              <Route path="/cheer" element={<Cheer />} />
              <Route path="/camps" element={<Camps />} />
              <Route path="/special-events" element={<SpecialEvents />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/birthday-parties" element={<BirthdayParties />} />
              <Route path="/college-recruits" element={<CollegeRecruits />} />
              <Route path="/baseball" element={<Baseball />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Protected><ParentDashboard /></Protected>} />
              <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
