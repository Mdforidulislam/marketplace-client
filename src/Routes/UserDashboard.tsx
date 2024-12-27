import { Navigate } from "react-router-dom";
import UserDashboard from "../Dashboard/UserDashoboard/UserDashboard";
import AddPost from "../Pages/Users/AddPost/AddPost";
import DetailPage from "../Pages/Users/Marketplace/DetailPage/DetailPage";
import Marketplace from "../Pages/Users/Marketplace/Marketplace";
import ProtectedRoute from "../PrivetRoutes/ProtectedRoute";

const UserRoutes = [
  {
    path: "/",
    element: <Navigate to="/" replace={true} />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Marketplace />,
      },
      {
        path: "details/:id",
        element: <DetailPage />,
      },
      {
        path: "add-post",
        element: <AddPost />,
      },
    ],
  },
];

export default UserRoutes;
