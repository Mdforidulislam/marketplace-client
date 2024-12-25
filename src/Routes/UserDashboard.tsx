import UserDashboard from "../Dashboard/UserDashoboard/UserDashboard";
import AddPost from "../Pages/Users/AddPost/AddPost";
import DetailPage from "../Pages/Users/Marketplace/DetailPage/DetailPage";
import Marketplace from "../Pages/Users/Marketplace/Marketplace";
import ProtectedRoute from "../PrivetRoutes/ProtectedRoute";

const UserRoutes = [
  {
    path: "/user",
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
