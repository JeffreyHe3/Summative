import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import "./DetailView.css";

function DetailView() {
    const { user, cart, setCart, purHis } = useStoreContext();
    const param = useParams();
    const [movies, setMovies] = useState([]);
    const [videos, setVideos] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        async function getData() {
            setMovies((await axios.get(`https://api.themoviedb.org/3/movie/${param.id}?api_key=${import.meta.env.VITE_TMDB_KEY}`)).data);
            setVideos((await axios.get(`https://api.themoviedb.org/3/movie/${param.id}/videos?language=en-US&api_key=${import.meta.env.VITE_TMDB_KEY}`)).data.results);
        };

        getData();
    }, [param.id]);

    const handleAddToCart = (movie) => {
        const movieDetails = { "poster_path": movie.poster_path, "title": movie.title }
        const updatedCart = cart.set(movie.id, movieDetails);
        setCart(updatedCart);
        const vanillaCart = updatedCart.toJS();
        const parseCart = JSON.stringify(vanillaCart);
        localStorage.setItem(`${user.uid}-cart`, parseCart);
    };

    return (
        <div id="detailsContainer">
            <div className="imageContainer">
                <button className="button" onClick={() => navigate(-1)}>Back</button><br />
                {movies.poster_path && <img key={movies.id} id="movieImage" src={`https://image.tmdb.org/t/p/w500${movies.poster_path}`} alt={movies.title}></img>}<br />
                <button className="buyButtons" onClick={() => handleAddToCart(movies)} disabled={cart.has(movies.id) || purHis.has(movies.id)}>{cart.has(movies.id) || purHis.has(movies.id) ? "Added" : "Buy"}</button>
            </div>
            <div id="allDetails">
                <h2>Title:</h2>
                <p>{movies.title}</p>
                <h3>Tagline:</h3>
                <p>{movies.tagline}</p>
                <h2>Trailers</h2>
                {movies && videos.filter(video => video.type.toLowerCase() === "trailer").map(video => (
                    <iframe key={video.key} className="trailers" width="420" height="315" src={`https://www.youtube.com/embed/${video.key}`} title={video.name} allowFullScreen />
                ))}
                <h2>Overview:</h2>
                <p>{movies.overview}</p>
                <h2>Release Date:</h2>
                <p>{movies.release_date}</p>
                <h2>Runtime:</h2>
                <p>{movies.runtime} minutes</p>
                <h2>Original Language:</h2>
                <p>{movies.original_language}</p>
                <h2>Spoken Languages:</h2>
                {movies.spoken_languages && movies.spoken_languages.map((movie) => (
                    <li key={movie.name}>{movie.name}</li>
                ))}
                <h2>Genres:</h2>
                {movies.genres && movies.genres.map((movie) => (
                    <li key={movie.name}>{movie.name}</li>
                ))}
                <h2>Production Companies: </h2>
                {movies.production_countries && movies.production_companies.map((movie) => (
                    <li key={movie.name}>{movie.name}</li>
                ))}
                <h2>Production Countries: </h2>
                {movies.production_countries && movies.production_countries.map((movie) => (
                    <li key={movie.name}>{movie.name}</li>
                ))}
            </div>
        </div>
    )
}

export default DetailView;