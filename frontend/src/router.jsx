import { createBrowserRouter } from "react-router-dom";
import Main from "./pages/Main";
import Planets from "./pages/Planets";
import Market from "./pages/Market";
import Laboratory from './pages/Laboratory';
import Wallet from './pages/Wallet';
import AdminPage from "./pages/admin/Admin";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />
    },
    {
        path: '/planets',
        element: <Planets />
    },
    {
        path: '/market',
        element: <Market />
    },
    {
        path: '/laboratory',
        element: <Laboratory />
    },
    {
        path: '/wallet',
        element: <Wallet />
    },
    {
        path: '/admin/*',
        element: <AdminPage />
    }
]);

export default router;