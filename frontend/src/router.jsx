import { createBrowserRouter } from "react-router-dom";
import AdminPage from "./pages/admin/Admin";
import Detail from "./pages/Detail";
import Laboratory from "./pages/Laboratory";
import Main from "./pages/Main";
import Market from "./pages/Market";
import Planets from "./pages/Planets";
import Wallet from "./pages/Wallet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/planets",
    element: <Planets />,
  },
  {
    path: "/market",
    element: <Market />,
  },
  {
    path: "/laboratory",
    element: <Laboratory />,
  },
  {
    path: "/wallet",
    element: <Wallet />,
  },
  {
    path: "/admin/*",
    element: <AdminPage />,
  },
  {
    path: "/planet/:planetId",
    element: <Detail />,
  },
]);

export default router;
