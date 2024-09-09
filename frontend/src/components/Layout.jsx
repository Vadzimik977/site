import { useTonAddress } from "@tonconnect/ui-react";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
    const adress = useTonAddress();
    window.adress = adress;
    
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
