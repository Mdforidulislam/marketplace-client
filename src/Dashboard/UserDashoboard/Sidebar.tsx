import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import { TbLogout } from "react-icons/tb";

interface SidebarProps {
  tabs: { path: string; label: string }[];
  isAuthenticated: boolean;
  logOutHandle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tabs, isAuthenticated, logOutHandle }) => {
  return (
    <div className="sidebar">
      {tabs.map((tab) => (
        <Link key={tab.path} to={tab.path}>
          <Button
            color="primary"
            className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
          >
            {tab.label}
          </Button>
        </Link>
      ))}
      {isAuthenticated && (
        <Button
          onClick={logOutHandle}
          color="primary"
          className="w-full flex justify-start font-medium items-center gap-2.5 p-4 pl-6 text-lg"
        >
          <TbLogout />
          Logout
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
