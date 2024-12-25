import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../Redux/hooks/hooks";
import { clearAuth } from "../../Redux/Features/User/authSlice";


export const fetchTabs = async (
  setTabs: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>
) => {
  try {
    const response = await fetch("/tabs.json");
    const data = await response.json();
    setTabs(data);
  } catch (error) {
    console.error("Error fetching tabs:", error);
  }
};

export const scrollLeft = (menuRef: React.RefObject<HTMLDivElement>) => {
  if (menuRef.current) {
    menuRef.current.scrollBy({ left: -200, behavior: "smooth" });
  }
};

export const scrollRight = (menuRef: React.RefObject<HTMLDivElement>) => {
  if (menuRef.current) {
    menuRef.current.scrollBy({ left: 200, behavior: "smooth" });
  }
};

export const logOutHandle = async (
  dispatch: ReturnType<typeof useAppDispatch>,
  navigate: ReturnType<typeof useNavigate>
) => {
  try {
    dispatch(clearAuth());
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


export const headerStyles: React.CSSProperties = {
  width: "100%",
  zIndex: 40,
  borderBottom: "1px solid #f0f2f5",
  background: "#f0f2f5",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

