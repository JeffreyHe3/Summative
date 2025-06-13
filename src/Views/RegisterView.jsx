import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../Context";
import "./RegisterView.css";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

function RegisterView() {
    const { setUser, setGenres, genres, purHis } = useStoreContext();
    const [checkedGenres, setCheckedGenres] = useState([]);
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', password2: '' });

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleChecked = (e) => {
        const updatedGenres = genres.map(genre =>
            genre.id === e.target.id ? { ...genre, isChosen: e.target.checked } : genre
        );

        setCheckedGenres(prev =>
            e.target.checked ? [...prev, e.target.id] : prev.filter(gid => gid !== e.target.id)
        );

        setGenres(updatedGenres);
    };

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
            const newUser = result.user;
            setUser(newUser);
            
            await updateProfile(auth.currentUser, {
                displayName: `${form.firstName} ${form.lastName}`
            })
            await auth.currentUser.reload();

            const docRef = doc(firestore, "users", newUser.uid);
            const data = { genrePreferences: checkedGenres, purchaseHistory: purHis.toJS() };
            await setDoc(docRef, data);

            navigate(`/movies/genres/${checkedGenres[0]}`);
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('Email already in use.');
                    break;
                case 'auth/weak-password':
                    alert('Password should be at least 6 characters.');
                    break;
                default:
                    alert('Registration error.');
            }
        }
    };

    const googleSignIn = async () => {
        if (checkedGenres.length < 5) {
            alert("Please select at least 5 favorite genres.");
            return;
        }

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const newUser = result.user;
            setUser(newUser);

            const docRef = doc(firestore, "users", newUser.uid);
            const data = { genrePreferences: checkedGenres, purchaseHistory: purHis.toJS() };
            await setDoc(docRef, data);

            navigate(`/movies/genres/${checkedGenres[0]}`);
        } catch (error) {
            alert("Google sign-in error");
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
                    <p id="genresTitle">Choose at least 5 genres you want to see</p>
                    {genres && genres.map(genre => (
                        <div key={genre.id}>
                            <input id={genre.id} type="checkbox" onChange={handleChecked}></input>
                            <label htmlFor={genre.id} className="inputLabel">{genre.name}</label>
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