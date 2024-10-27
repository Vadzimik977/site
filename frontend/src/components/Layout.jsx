import {
  useIsConnectionRestored,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";
import { createContext, useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import customSelect from "../assets/js/customSelect";
import { fetchDefaultUser } from "../assets/js/getUser";
import input from "../assets/js/input";
import marketAdaptiv from "../assets/js/marketAdaptiv";
import newCustomSelect from "../assets/js/newCustomSelect";
import popups from "../assets/js/popups";
import scroll from "../assets/js/scroll";
import { useUserStore } from "../store/userStore";
import {
  addPlanetToUser,
  getAllUserPlanets,
  getNfts,
  getPlanetByName,
} from "../utils/axios";
import Footer from "./Footer";
import Header from "./Header";

export const DataContext = createContext();
export default function Layout({ children, without = false }) {
  const { setNft } = useUserStore();
  const adress = useTonAddress();
  const wallet = useTonWallet();
  const connectionRestored = useIsConnectionRestored();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);
    await fetchDefaultUser();

    const nft = await getNfts(wallet.account.address);

    setNft(nft);

    if (nft?.length) {
      nft.map(async (item) => {
        const planet = await getPlanetByName({
          name: item.metadata.name.split("(")[0],
        });
        const allUserPlanets = await getAllUserPlanets();

        if (planet?.id) {
          if (!allUserPlanets.some((val) => val?.planetId === planet.id)) {
            await addPlanetToUser(planet.id);
            window.location.reload();
          }
        }
      });
    }
    const ev = new Event("getUser");
    document.dispatchEvent(ev);
    setIsLoading(false);
  };

  useEffect(() => {
    if (connectionRestored && adress && !isFetched) {
      setIsFetched(true);
      fetchUser();
      // const apiUrl = `https://tonapi.io/v2/accounts/${wallet.account.address}/nfts?collection=EQDfb4GXKIaToaFUDihPgB_lGePg-yeYjwrkZZAeKZ7m9xOQ&limit=1000&offset=0&indirect_ownership=false`;
      // const resp = axios.get(apiUrl);
    }
    if (connectionRestored && !adress) {
      setIsLoading(false);
      const ev = new Event("getUser");
      document.dispatchEvent(ev);
    }
  }, [connectionRestored, adress]);

  useEffect(() => {
    if (!isLoading) {
      marketAdaptiv();
      customSelect();
      popups();
      without ? "" : scroll();
      input();
      newCustomSelect();
    }
  }, [isLoading]);

  return !isLoading ? (
    <>
      {without ? "" : <Header />}
      <main className={`main ${without ? "without" : ""}`}>
        <div className={`${without ? "without" : "container"}`}>{children}</div>
      </main>
      {without ? null : <Footer />}
    </>
  ) : (
    <div className="color-ring-wrapper">
      <ColorRing
        visible={isLoading}
        height={80}
        width={80}
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    </div>
  );
}
