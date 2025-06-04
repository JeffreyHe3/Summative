import "./MoviesView.css";
import { useStoreContext } from "../Context";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Genres from "../components/Genres";

function MovieView() {
    const { genres } = useStoreContext();

    return (
        <div id="container">
            <Header id="header" />
            <Genres genre={genres} id="genres" />
            <Outlet id="outlet" />
            <Footer id="footer" />
        </div>
    )
}

export default MovieView;