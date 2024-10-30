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

export const DataContext = createContext({});
export default function Layout({
  children,
  without = false,
}: {
  children: React.ReactNode;
  without?: boolean;
}) {
  const { setNft, setAddress, setUser, user } = useUserStore();
  const address = useTonAddress();
  const wallet = useTonWallet();
  const connectionRestored = useIsConnectionRestored();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (address) {
      setAddress(address);
    }
  }, [address]);

  const fetchUser = async () => {
    if (!address) return;

    setIsLoading(true);
    const user = await fetchDefaultUser();
    setUser(user);

    const nft = await getNfts();
    setNft(nft);

    if (nft?.length > 0) {
      const allUserPlanets = await getAllUserPlanets();

      nft.map(async (item) => {
        const planet = await getPlanetByName({
          name: item.metadata.name.split("(")[0],
        });

        if (planet?.id) {
          if (!allUserPlanets.some((val) => val?.planetId === planet.id)) {
            await addPlanetToUser(planet.id);
            window.location.reload();
          }
        }
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (connectionRestored && address && !isFetched && !user) {
      setIsFetched(true);
      fetchUser();
    }
    if (connectionRestored && !address) {
      setIsLoading(false);
    }
  }, [connectionRestored, address]);

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
