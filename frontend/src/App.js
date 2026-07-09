import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";

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
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ParentDashboard from "@/pages/ParentDashboard";
import AdminDashboard from "@/pages/AdminDashboard";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
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

const Page = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-right" theme="dark" richColors />
          <Routes>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/preschool" element={<Page><Preschool /></Page>} />
            <Route path="/recreational" element={<Page><Recreational /></Page>} />
            <Route path="/competitive" element={<Page><Competitive /></Page>} />
            <Route path="/cheer" element={<Page><Cheer /></Page>} />
            <Route path="/camps" element={<Page><Camps /></Page>} />
            <Route path="/special-events" element={<Page><SpecialEvents /></Page>} />
            <Route path="/calendar" element={<Page><CalendarPage /></Page>} />
            <Route path="/birthday-parties" element={<Page><BirthdayParties /></Page>} />
            <Route path="/college-recruits" element={<Page><CollegeRecruits /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Protected><Page><ParentDashboard /></Page></Protected>} />
            <Route path="/admin" element={<Protected admin><Page><AdminDashboard /></Page></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
