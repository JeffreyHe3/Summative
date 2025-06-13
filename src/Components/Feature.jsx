import axios from "axios";
import { useState, useEffect } from "react";
import "./style.css";

function Feature() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        async function getData() {
            setMovies((await axios.get(`https://api.themoviedb.org/3/movie/now_playing?include_adult=false&api_key=${import.meta.env.VITE_TMDB_KEY}`)).data.results.sort(() => 0.5 - Math.random()).slice(0, 4));
        }

        getData();
    }, []);

    return (
        <div>
            <h1 id="feature">Featured</h1>
            <div id="movieContainer">
                {movies && movies.map((movie) => (
                    <img key={movie.id} src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                ))}
            </div>
        </div>
    );
}

export default Feature;