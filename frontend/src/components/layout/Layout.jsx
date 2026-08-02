import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/common/AnnouncementBar";

export const Layout = ({ children }) => (
  <div className="grain min-h-screen bg-ink">
    <AnnouncementBar />
    <Navbar />
    <main className="pt-9">{children ?? <Outlet />}</main>
    <Footer />
  </div>
);

export default Layout;
