import React from "react";

interface HamburgerButtonProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  userRole: string;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  sidebarOpen,
  toggleSidebar,
  userRole,
}) => {
  return (
    <button
      className={` mt-4 ${
        sidebarOpen ? "bg-blue-100 rounded-full w-full" : ""
      }`}
    >
      {userRole ? (
        <>
          <label className="hamburger flex items-center justify-between pr-2">
            {sidebarOpen && (
              <span className="pl-6 text-2xl font-medium text-blue-600 mb-2">
                {userRole}
              </span>
            )}
            <input
              type="checkbox"
              checked={sidebarOpen}
              onChange={toggleSidebar}
              className="hidden"
            />
            <svg
              viewBox="0 0 32 32"
              className="w-12 h-12 transform transition-transform duration-300"
            >
              <path
                className={`${
                  sidebarOpen ? "stroke-blue-600" : "stroke-blue-600"
                } line line-top-bottom`}
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              ></path>
              <path
                className={`${
                  sidebarOpen ? "stroke-blue-600" : "stroke-blue-600"
                } line`}
                d="M7 16 27 16"
              ></path>
            </svg>
          </label>
        </>
      ) : (
        <>
          <label className="hamburger flex justify-center pr-3">
            <input
              type="checkbox"
              checked={sidebarOpen}
              onChange={toggleSidebar}
              className="hidden"
            />
            <svg
              viewBox="0 0 32 32"
              className="w-12 h-12 transform transition-transform duration-300"
            >
              <path
                className={`${
                  sidebarOpen ? "stroke-blue-600" : "stroke-blue-600"
                } line line-top-bottom`}
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
              ></path>
              <path
                className={`${
                  sidebarOpen ? "stroke-blue-600" : "stroke-blue-600"
                } line`}
                d="M7 16 27 16"
              ></path>
            </svg>
          </label>
        </>
      )}
    </button>
  );
};

export default HamburgerButton;
