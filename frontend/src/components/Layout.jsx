import Footer from "./Footer";
import Header from "./Header";

export default function Layout({ children }) {
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
