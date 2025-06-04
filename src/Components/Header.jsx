import "./style.css"
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import { useStoreContext } from "../Context";
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function Header() {
  const navigate = useNavigate();
  const { user, setUser, setGenres, genres, setCart, cart } = useStoreContext();
  const [name, setName] = useState([]);

  useEffect(() => {
    if (user && user.displayName) {
      setName(user.displayName.split(' '));
    }
  }, [user]);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    }
  }

  const onSearch = debounce((e) => {
    if (e.target.value) {
      navigate(`/movies/search/${e.target.value}`);
    }
  }, 500);

  const resetGenres = () => {
    setGenres(genres.map(genre => ({ ...genre, isChosen: false })));
    setCart(cart.clear());
  };

  return (
    <div id="header">
      <h1 className="title">Jeffrey's Movies</h1>
      {user ?
        <div>
          {/* fix name */}
          <h1 className="title">{`Hi ${name[0]}!`}</h1>
          <button className="headerButtons" onClick={() => navigate("/cart")}>Cart</button>
          <button className="headerButtons" onClick={() => navigate("/settings")}>Settings</button>
          <button className="headerButtons" onClick={() => { setUser(null); signOut(auth);; resetGenres(); navigate("/"); }}>Logout</button><br />
          <input type="text" id="searchBar" placeholder="Search Movies Here" autoComplete="off" onInput={(e) => onSearch(e)} />
        </div>
        :
        <div>
          <button className="headerButtons" onClick={() => navigate("/login")}>Login</button>
          <button className="headerButtons" onClick={() => navigate("/register")}>Register</button>
        </div>
      }
    </div>
  );
}

export default Header;