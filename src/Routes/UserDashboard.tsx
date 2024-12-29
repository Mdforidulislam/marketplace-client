import { Navigate } from "react-router-dom";
import UserDashboard from "../Dashboard/UserDashoboard/UserDashboard";
import AddPost from "../Pages/Users/AddPost/AddPost";
import DetailPage from "../Pages/Users/Marketplace/DetailPage/DetailPage";
import Marketplace from "../Pages/Users/Marketplace/Marketplace";
import ProtectedRoute from "../PrivetRoutes/ProtectedRoute";
import Contact from "../Pages/Users/Marketplace/Contact/Contact";

const Routes = [
  {
    path: "/",
    element: <Navigate to="/" replace={true} />,
  },
  // User Routes
  {
    path: "/",
    element: <UserDashboard />,
    children: [
      {
        index: true,
        element: <Marketplace />,
      },
      {
        path: "contact/:id",
        element: (
          <ProtectedRoute requiredRole="user">
            <Contact />
          </ProtectedRoute>
        ),
      },
      {
        path: "details/:id",
        element: (
          <ProtectedRoute requiredRole="user">
            <DetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "add-post",
        element: (
          <ProtectedRoute requiredRole="user">
            <AddPost />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default Routes;
