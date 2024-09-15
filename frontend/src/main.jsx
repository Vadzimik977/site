import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

//import './css/style.min.css'
import "./scss/style.scss";
import "./css/libs.min.css";
import "./assets/js/animatedBorder.js";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import router from "./router.jsx";
import './i18n.js';

createRoot(document.getElementById("root")).render(
    <>
        <TonConnectUIProvider manifestUrl="https://gist.githubusercontent.com/siandreev/75f1a2ccf2f3b4e2771f6089aeb06d7f/raw/d4986344010ec7a2d1cc8a2a9baa57de37aaccb8/gistfile1.txt">
            <RouterProvider router={router} />
        </TonConnectUIProvider>
    </>
);
