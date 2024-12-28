import React, { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/hooks/hooks";
import { BsShopWindow } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import { clearAuth } from "../../Redux/Features/User/authSlice";
import HamburgerButton from "./HamburgerButton";
import {NextUIProvider} from "@nextui-org/react";
const { Content } = Layout;

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const LogOutDispatch = useAppDispatch();
  const navigate = useNavigate();

  const appPost = location.pathname === "/user" || location.pathname === "/";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logOutHandle = async () => {
    try {
      LogOutDispatch(clearAuth());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Layout hasSider style={{ height: "auto" }}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-60" : "w-0"
        } bg-white text-black`}
      >
        <HamburgerButton
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div
          className={`${
            sidebarOpen
              ? "opacity-100 transition-opacity delay-200"
              : "opacity-0"
          } flex flex-col items-center pt-6 px-4 pr-5 space-y-4`}
        >
          <Link to="/admin" className="w-full">
            <Button
              color="primary"
              className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
              variant="filled"
            >
              <BsShopWindow className="" />
              Users
            </Button>
          </Link>
          <Button
            onClick={logOutHandle}
            color="primary"
            className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
            variant="filled"
          >
            <TbLogout className="" />
            Logout
          </Button>
        </div>
      </div>
      <Layout style={{ marginTop: appPost ? 70 : undefined }}>
        <Content
          className={`max-w-[1240px] mx-auto px-2`}
          style={{
            minHeight: "100vh",
          }}
        >
          <NextUIProvider>
            <Outlet />
          </NextUIProvider>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
