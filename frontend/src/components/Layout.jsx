import { useTonAddress } from "@tonconnect/ui-react";
import Footer from "./Footer";
import Header from "./Header";
import { useEffect } from "react";
import BorderAnimation from "../assets/js/animatedBorder";
import marketAdaptiv from "../assets/js/marketAdaptiv";
import customSelect from "../assets/js/customSelect";
import popups from "../assets/js/popups";
import scroll from "../assets/js/scroll";
import input from "../assets/js/input";
import newCustomSelect from "../assets/js/newCustomSelect";

export default function Layout({ children }) {
    const adress = useTonAddress();
    window.adress = adress;
    useEffect(() => {
        marketAdaptiv();
        customSelect();
        popups();
        scroll();
        input();
        newCustomSelect()
    }, [])
    return (
        <>
            <Header />
            <main className="main">
                <div className="container">{children}</div>
            </main>
            <Footer />
        </>
    );
}
