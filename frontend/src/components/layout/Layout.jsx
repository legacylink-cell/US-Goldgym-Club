import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import MobileCallBar from "@/components/common/MobileCallBar";
import SiteNotice from "@/components/common/SiteNotice";

export const Layout = ({ children }) => (
  <div className="grain min-h-screen bg-ink">
    <AnnouncementBar />
    <Navbar />
    <SiteNotice />
    <main className="pt-9 pb-16 md:pb-0">{children ?? <Outlet />}</main>
    <Footer />
    <MobileCallBar />
  </div>
);

export default Layout;
