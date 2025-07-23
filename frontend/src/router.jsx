import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout"; // ⬅ оборачиваем всё
import Main from "./pages/Main";
import Planets from "./pages/Planets";
import Market from "./pages/Market";
import Laboratory from './pages/Laboratory';
import Wallet from './pages/Wallet';
import AdminPage from "./pages/admin/Admin";
import Tasks from "./pages/Tasks/Tasks";
import PlanetMain from "./components/main/PlanetMain";
import UpgradePlanet from "./components/Popup/UpgradePlanet";
import ShipMarket from "./pages/Shipmarket";

const router = createBrowserRouter([
  // Main — без Layout
  {
    path: '/',
    element: <Main />
  },

  // Все остальные страницы — внутри Layout
  {
    element: <Layout />,
    children: [
      { path: '/planets', element: <Planets /> },
      { path: '/market', element: <Market /> },
      { path: '/laboratory', element: <Laboratory /> },
      { path: '/wallet', element: <Wallet /> },
      { path: '/tasks', element: <Tasks /> },
      { path: '/admin/*', element: <AdminPage /> },
      { path: '/planet/:planetId', element: <PlanetMain /> },
      { path: '/shipmarket', element: <ShipMarket /> }
    ]
  }
]);


export default router;
