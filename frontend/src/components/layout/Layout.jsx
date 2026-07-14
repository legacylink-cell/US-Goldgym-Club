import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const Layout = ({ children }) => (
  <div className="grain min-h-screen bg-ink">
    <Navbar />
    <main>{children ?? <Outlet />}</main>
    <Footer />
  </div>
);

export default Layout;
