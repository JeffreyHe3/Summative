import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import "./GenreView.css";

function GenreView() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    let page = useRef(1);
    let pages = useRef(0);
    const { user, cart, setCart, purHis } = useStoreContext();
    const param = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        async function getData() {
            const res = ((await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${param.genre_id}&api_key=${import.meta.env.VITE_TMDB_KEY}`)).data);
            setMovies(res.results);
            pages.current = res.total_pages;
        }
        getData();
    }, [param.genre_id]);

    const getMoreData = async (direction) => {
        const nextPage = page.current + direction;
        if (nextPage > 0 && nextPage <= pages.current) {
            setLoading(true);
            page.current = nextPage;
            try {
                setMovies((await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${nextPage}&sort_by=popularity.desc&with_genres=${param.genre_id}&api_key=${import.meta.env.VITE_TMDB_KEY}`)).data.results);
            } catch (error) {
                alert("Error fetching API");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddToCart = (movie) => {
        const movieDetails = { "poster_path": movie.poster_path, "title": movie.title }
        const updatedCart = cart.set(movie.id, movieDetails);
        setCart(updatedCart);
        const vanillaCart = updatedCart.toJS();
        const parseCart = JSON.stringify(vanillaCart);
        localStorage.setItem(`${user.uid}-cart`, parseCart);
    };

    return (
        <div>
            <div className="movieContainer">
                {movies && movies.map(movie => (
                    <div className="movieBox" key={movie.id}>
                        <div className="movieCard" onClick={() => navigate(`/movies/details/${movie.id}`)}>
                            <h1 className="movieTitle">{`${movie.title}`}</h1>
                            <img className="moviePoster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.id}`} />
                        </div>
                        <button className="buyButtons" onClick={() => handleAddToCart(movie)} disabled={cart.has(movie.id) || purHis.has(movie.id)}>{cart.has(movie.id) || purHis.has(movie.id) ? "Added" : "Buy"}</button>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button className="pageButtons" onClick={() => getMoreData(-1)} disabled={loading || page.current === 1}>Prev</button>
                <p className="movieText">{`Page ${page.current} of ${pages.current}`}</p>
                <button className="pageButtons" onClick={() => getMoreData(1)} disabled={loading || page.current === pages.current}>Next</button>
            </div>
            {loading && <p>Loading...</p>}
        </ div>
    )
}

export default GenreView;