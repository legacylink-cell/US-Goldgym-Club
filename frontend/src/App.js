import { useEffect, lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import AnalyticsTracker from "@/components/common/AnalyticsTracker";

import Home from "@/pages/Home";
const About = lazy(() => import("@/pages/About"));
const Preschool = lazy(() => import("@/pages/Preschool"));
const Recreational = lazy(() => import("@/pages/Recreational"));
const Competitive = lazy(() => import("@/pages/Competitive"));
const Cheer = lazy(() => import("@/pages/Cheer"));
const Camps = lazy(() => import("@/pages/Camps"));
const SpecialEvents = lazy(() => import("@/pages/SpecialEvents"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const BirthdayParties = lazy(() => import("@/pages/BirthdayParties"));
const CollegeRecruits = lazy(() => import("@/pages/CollegeRecruits"));
const Contact = lazy(() => import("@/pages/Contact"));
const Careers = lazy(() => import("@/pages/Careers"));
const Baseball = lazy(() => import("@/pages/Baseball"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const ParentDashboard = lazy(() => import("@/pages/ParentDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `https://www.usgoldgymclub.com${pathname === "/" ? "/" : pathname}`;
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
          <Suspense fallback={<div className="min-h-screen bg-ink" />}>
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
            </Route>
            <Route path="/dashboard" element={<Protected><ParentDashboard /></Protected>} />
            <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
