import Login from "../Pages/Login/Login";
import UnAuthorized from "../Pages/Unauthorized/UnAuthorized";
import AdminDashboardd from "../Dashboard/AdminDashboard/AdminDashobard";
import AllUsers from "../Pages/Admin/AllUsers/AllUsers";
import SignUp from "../Pages/SingIn/SignUp";
import ProtectedRoute from "../PrivetRoutes/ProtectedRoute";

const Adminroutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/singup",
    element: <SignUp />,
  },
  {
    path: "/unauthorized",
    element: <UnAuthorized />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboardd />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRole="admin">
            <AllUsers />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default Adminroutes;
