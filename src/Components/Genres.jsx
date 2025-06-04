import { NavLink } from "react-router-dom";
import "./style.css"

function Genres(props) {
    return (
        <div>
            <h1 id="gTitle">Genres</h1>
            {props.genre.filter(genreList => genreList.isChosen).map(genreList => (
                <div key={genreList.id} className="movies-nav">
                    <NavLink to={`genres/${genreList.id}`} className="genreButtons">{genreList.genre}</NavLink>
                </div>
            ))}
        </div>
    )
}

export default Genres;