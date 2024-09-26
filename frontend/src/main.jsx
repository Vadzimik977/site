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
        <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/makasinui/tonconnect/refs/heads/main/manifest.json">
            <RouterProvider router={router} />
        </TonConnectUIProvider>
    </>
);

window.addEventListener('ton-connect-ui-disconnection', (event) => {
    window.location.reload();
})
