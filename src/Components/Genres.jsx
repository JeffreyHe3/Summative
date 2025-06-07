import { NavLink } from "react-router-dom";
import "./style.css"

function Genres(props) {
    return (
        <div>
            <h1 id="gTitle">Genres</h1>
            {props.genre.filter(genre => genre.isChosen).map(genre => (
                <div key={genre.id} className="moviesNav">
                    <NavLink to={`genres/${genre.id}`} className="genreButtons">{genre.name}</NavLink>
                </div>
            ))}
        </div>
    )
}

export default Genres;