import { createBrowserRouter } from "react-router-dom";
import AdminPage from "./pages/admin/Admin";
import Detail from "./pages/Detail";
import Laboratory from "./pages/Laboratory";
import Main from "./pages/Main";
import Market from "./pages/Market";
import Planets from "./pages/Planets";
import Tasks from "./pages/Tasks/Tasks";
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
    path: "/planet/:planetId",
    element: <Detail />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
  },
  {
    path: "/admin/*",
    element: <AdminPage />,
  }
]);

export default router;
