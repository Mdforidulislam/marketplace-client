import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Dropdown, Layout, Space, Spin } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../Redux/hooks/hooks";
import { BsShopWindow } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import { MdLibraryAdd } from "react-icons/md";
import { headerStyles } from "./userDashboardfunctions";
import { setSelectedTab } from "../../Redux/Features/Tabs/SelectedtabSlice";
import { clearAuth, logoutUser } from "../../Redux/Features/User/authSlice";
import HamburgerButton from "../AdminDashboard/HamburgerButton";
import { DownOutlined } from "@ant-design/icons";
import { fetchCategories } from "../../Redux/Features/Tabs/TabsSlice";
import { SiMonkeytie } from "react-icons/si";


const { Header, Content } = Layout;

const UserDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const LogOutDispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, userRole } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);
  const { selectedTab } = useAppSelector((state) => state.tab);
  const [tabs, setTabs] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length > 0) {
      const formattedTabs = categories.map((category, index) => ({
        id: index,
        name: category.name,
      }));
      setTabs(formattedTabs);
    }
  }, [categories]);

  const handleTabClick = (category: string) => {
    dispatch(setSelectedTab(category));
  };

  const renderTabs = () => (
    <div
      className={`max-w-[600px] lg:max-w-[1200px] flex flex-wrap mx-auto justify-center items-center gap-2 py-2`}
    >
      {tabs.map((item, index) => (
        <Button
          key={item?.id || `tab-${index}`}
          className={`text-md font-medium border-none ${
            selectedTab === item.name
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-600 hover:bg-blue-100 hover:text-blue-600"
          }`}
          onClick={() => handleTabClick(item.name)}
        >
          {item?.name}
        </Button>
      ))}
    </div>
  );

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

  const logOutHandle = useCallback(async () => {
    try {
      LogOutDispatch(clearAuth());
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [LogOutDispatch, navigate, dispatch]);

  const items = tabs.map((item, index) => ({
    label: (
      <Button
        className={`w-full text-md font-medium border-none ${
          selectedTab === item.name
            ? "bg-blue-600 text-white"
            : "bg-blue-100 text-blue-600"
        }`}
        key={item?.id || `tab-${index}`}
        onClick={() => handleTabClick(item.name)}
      >
        {item.name}
      </Button>
    ),
    key: item.id || `tab-${index}`,
  }));

  const sidebarItems = useMemo(() => {
    if (isAuthenticated) {
      return [
        {
          label: (
            <Link to="/" className="w-full">
              <Button
                color="primary"
                className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
                variant="filled"
              >
                <BsShopWindow className="" />
                Marketplace
              </Button>
            </Link>
          ),
          key: "marketplace",
        },
        {
          label: (
            <Link to="/add-post" className="w-full">
              <Button
                color="primary"
                className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
                variant="filled"
              >
                <MdLibraryAdd className="" />
                Add Post
              </Button>
            </Link>
          ),
          key: "add-post",
        },
        {
          label: (
            <Button
              onClick={logOutHandle}
              color="primary"
              className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
              variant="filled"
            >
              <TbLogout className="" />
              Logout
            </Button>
          ),
          key: "logout",
        },
      ];
    } else {
      return [
        {
          label: (
            <Link to="/" className="w-full">
              <Button
                color="primary"
                className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
                variant="filled"
              >
                <BsShopWindow className="" />
                Marketplace
              </Button>
            </Link>
          ),
          key: "marketplace",
        },
        {
          label: (
            <Link to="/login" className="w-full">
              <Button
                color="primary"
                className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
                variant="filled"
              >
                <SiMonkeytie/>
                Login
              </Button>
            </Link>
          ),
          key: "login",
        },
      ];
    }
  }, [isAuthenticated, logOutHandle]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout hasSider style={{ height: "auto" }}>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-56 px-2.5" : "w-0"
        } bg-white text-black`}
      >
        <HamburgerButton
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          userRole={userRole!}
        />

        <div
          className={`${
            sidebarOpen
              ? "opacity-100 transition-opacity delay-200"
              : "opacity-0"
          }  pt-6 space-y-4`}
        >
          {sidebarItems.map((item) => (
            <div key={item.key}>{item.label}</div>
          ))}
        </div>
      </div>
      <Layout
        className={`${
          appPost ? "mt-[20%] lg:mt-[110px]" : "mt-0"
        } transition-all duration-300 ease-in-out`}
      >
        {appPost && (
          <Header
            className="fixed top-0 pl-0 h-auto overflow-hidden px-[10%]"
            style={headerStyles}
          >
            <div className="flex justify-between items-center">
              <div className="hidden md:flex">{renderTabs()}</div>
              <div className="fixed -top-1 right-2.5 md:hidden">
                <Dropdown menu={{ items }} trigger={["click"]}>
                  <Button
                    className="text-md font-medium"
                    variant="filled"
                    color="primary"
                    onClick={(e) => {
                      setIsDropdownOpen(!isDropdownOpen);
                      e.preventDefault();
                    }}
                  >
                    <Space>
                      Categories
                      <DownOutlined className="text-md font-bold" />
                    </Space>
                  </Button>
                </Dropdown>
              </div>
            </div>
          </Header>
        )}
        <Content
          className={`max-w-[1240px] mx-auto px-2`}
          style={{ minHeight: "100vh" }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserDashboard;
