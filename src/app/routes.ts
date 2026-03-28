import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ScannerView from "./pages/ScannerView";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      { index: true, Component: AdminPanel },
    ],
  },
  {
    path: "/scanner",
    element: <ProtectedRoute allowedRoles={["admin", "profesor"]} />,
    children: [
      { index: true, Component: ScannerView },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={["admin", "profesor"]} />,
    children: [
      { index: true, Component: Dashboard },
    ],
  },
]);
