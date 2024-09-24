import {
    useTonAddress,
    useTonWallet,
    useIsConnectionRestored,
} from "@tonconnect/ui-react";
import Footer from "./Footer";
import Header from "./Header";
import { createContext, useEffect, useState } from "react";
import BorderAnimation from "../assets/js/animatedBorder";
import marketAdaptiv from "../assets/js/marketAdaptiv";
import customSelect from "../assets/js/customSelect";
import popups from "../assets/js/popups";
import scroll from "../assets/js/scroll";
import input from "../assets/js/input";
import newCustomSelect from "../assets/js/newCustomSelect";
import { addPlanetToUser, createUser, getAllUserPlanets, getNfts, getPlanetByName, getPlanets, getUser } from "../utils/axios";
import { fetchDefaultUser } from "../assets/js/getUser";
import axios from "axios";
import { ColorRing } from 'react-loader-spinner'

export const DataContext = createContext();
export default function Layout({ children }) {
    const adress = useTonAddress();
    const wallet = useTonWallet();
    const connectionRestored = useIsConnectionRestored();
    const [isLoading, setIsLoading] = useState(true);
    const [isFetched, setIsFetched] = useState(false);

    window.adress = adress;
    const fetchUser = async () => {
        setIsLoading(true);
        await fetchDefaultUser();
        
        window.user.nft = await getNfts(wallet.account.address);
        if(window.user.nft?.length) {
            const nft = window.user.nft;
            nft.map(async(item) => {
                
                const planet = await getPlanetByName({name: item.metadata.name.split('(')[0]});
                const allUserPlanets = await getAllUserPlanets();
                
                if(planet?.id) {
                    if(!allUserPlanets.some(val => val?.planetId === planet.id)) {
                        await addPlanetToUser(planet.id);
                        window.location.reload();
                    }
                }
            })
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        
        if (connectionRestored && adress && !isFetched) {
            setIsFetched(true);
            fetchUser();
            // const apiUrl = `https://tonapi.io/v2/accounts/${wallet.account.address}/nfts?collection=EQDfb4GXKIaToaFUDihPgB_lGePg-yeYjwrkZZAeKZ7m9xOQ&limit=1000&offset=0&indirect_ownership=false`;
            // const resp = axios.get(apiUrl);
        }
        if(connectionRestored && !adress) {
            setIsLoading(false)
            window.adress = 'not'
        }
    }, [connectionRestored, adress]);

    useEffect(() => {
        if(!isLoading) {

            marketAdaptiv();
            customSelect();
            popups();
            scroll();
            input();
            newCustomSelect();
        }
    }, [isLoading]);
    
    return (
        !isLoading ? (
            <>
                <Header />
                <main className="main">
                    <div className="container">{children}</div>
                </main>
                <Footer />
            </>
        ) : (
            <div className="color-ring-wrapper">
                <ColorRing
                    visible={isLoading}
                    height={80}
                    width={80}
                    colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                />
            </div>
        )
    );
}
