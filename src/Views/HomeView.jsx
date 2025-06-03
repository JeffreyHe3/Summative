import "./HomeView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Feature from "../components/Feature";

function HomeView() {
    return (
        <div>
            <Header />
            <Hero />
            <Feature />
            <Footer />
        </div>
    );
}

export default HomeView;