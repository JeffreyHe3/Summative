import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import "./RegisterView.css";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

function RegisterView() {
    const { setUser, setFGenre, fGenre } = useStoreContext();
    const [checkedGenres, setcheckedGenres] = useState([]);
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', password2: '' });
    const genreList = [
        {
            "genre": "Action", "id": 28
        },
        {
            "genre": "Adventure", "id": 12
        },
        {
            "genre": "Animation", "id": 16
        },
        {
            "genre": "Crime", "id": 80
        },
        {
            "genre": "Family", "id": 10751
        },
        {
            "genre": "Fantasy", "id": 14
        },
        {
            "genre": "History", "id": 36
        },
        {
            "genre": "Horror", "id": 27
        },
        {
            "genre": "Mystery", "id": 9648
        },
        {
            "genre": "Sci-Fi", "id": 878
        },
        {
            "genre": "War", "id": 10752
        },
        {
            "genre": "Western", "id": 37
        }
    ]

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleChecked = (e) => {
        const genreId = parseInt(e.target.id);
        if (e.target.checked) {
            setcheckedGenres(prev => [...prev, genreId]);
        } else {
            setcheckedGenres(prev => prev.filter(id => id !== genreId));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.password2) {
            alert("Passwords do not match.");
            return;
        }

        if (checkedGenres.length < 5) {
            alert("Please select at least 5 favorite genres.");
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, form.email, form.password);
            setUser(result.user);
            // get from firebase
            setFGenre(checkedGenres);
            navigate(`/movies/genres/${checkedGenres[0]}`);
        } catch (error) {
            // errors for invalid passwords, account already created, etc
            console.error("Error creating user:", error);
        }
    };

    const googleSignIn = async () => {
        if (checkedGenres.length < 5) {
            alert("Please select at least 5 favorite genres.");
            return;
        }

        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            setUser(result.user);
            navigate(`/movies/genres/${checkedGenres[0]}`);
        } catch (error) {
            console.error("Google sign-in error:", error.message);
        }
    };

    return (
        <div>
            <Header />
            <div id="rForm" >
                <h1 id="rTitle">Register</h1>
                <form onSubmit={handleSubmit}>
                    <input id="firstName" type="text" className="input" name="firstName" placeholder="First Name" onChange={handleChange} required />
                    <input id="lastName" type="text" className="input" name="lastName" placeholder="Last Name" onChange={handleChange} required />
                    <input id="email" type="email" className="input" name="email" autoComplete="on" placeholder="Email" onChange={handleChange} required />
                    <input id="password" type="password" className="input" name="password" placeholder="Password" onChange={handleChange} required />
                    <input id="password2" type="password" className="input" name="password2" placeholder="Re-enter Password" onChange={handleChange} required />
                    <p id="genreListTitle">Choose at least 5 of your favourite genres</p>
                    {genreList && genreList.map(genre => (
                        <div key={genre.id}>
                            <input id={genre.id} type="checkbox" onChange={handleChecked}></input>
                            <label htmlFor={genre.id} className="inputLabel">{genre.genre}</label>
                        </div>
                    ))}
                    <input id="submitButton" type="submit" value="Register" />
                </form>
                <button onClick={googleSignIn} className="googleSigninBtn"><img src="googleIcon.png" className="googleIcon" alt="Google Icon"></img> Google Sign In</button>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterView;