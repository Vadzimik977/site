import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./scss/style.scss";
import "./css/libs.min.css";
import "./assets/js/animatedBorder.js";
import { TonConnectUIProvider, useTonWallet, useTonConnectModal, useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import router from "./router.jsx";
import "./i18n.js";
import { useIsConnectionRestored } from '@tonconnect/ui-react';
  import {
    addPlanetToUser,
    createUser,
    getAllUserPlanets,
    getNfts,
    getPlanetByName,
    getUserByTgId,
    getUser,
  } from "./utils/axios";


function AppContent() {
  const wallet = useTonWallet();

  return <RouterProvider router={router} />;
}

function AppInner() {
  const { state } = useTonConnectModal();
  const [tonConnectUI] = useTonConnectUI();
  const prevWalletRef = useRef(null);

  const address = useTonAddress();

  useEffect(() => {
    if (address && window?.user?.id === 9999) {
      console.log("Адрес есть и user.id === 9999 — перезагружаем");
      window.location.reload();
      user =  getUser(address);
      if (!user) {
        user =  createUser({
          tg_id: tgUser.id,
          userName: tgUser.username,
          address,
        });
      }
    }
  }, [address]);

  useEffect(() => {
    if (!tonConnectUI) return;

    



    return () => {
      // tonConnectUI.offStatusChange(handleStatusChange);
    };
  }, [tonConnectUI]);

  useEffect(() => {
    const handleDisconnect = () => {
      console.log("ton-connect-ui-disconnection event — перезагружаем страницу");
      window.location.reload();
    };

    window.addEventListener('ton-connect-ui-disconnection', handleDisconnect);

    return () => {
      window.removeEventListener('ton-connect-ui-disconnection', handleDisconnect);
    };
  }, []);

  console.log("Modal state:", state);

  return <AppContent />;
}

function AppWrapper() {
  return (
    <TonConnectUIProvider
      manifestUrl="https://raw.githubusercontent.com/makasinui/tonconnect/refs/heads/main/manifest.json"
      actionsConfiguration={{
        twaReturnUrl: window.location.href,
      }}
    >
      <AppInner />
    </TonConnectUIProvider>
  );
}

createRoot(document.getElementById("root")).render(<AppWrapper />);
