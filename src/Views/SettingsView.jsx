import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom"
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
// 
function SettingsView() {
    const { user, setGenres, genres, purHis } = useStoreContext();
    const [saved, setSaved] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [name, setName] = useState([]);
    const [form, setForm] = useState({ firstName: '', lastName: '', password: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.displayName) {
            setName(user.displayName.split(' '));
        }
        // check if user is signed in with google
        setIsGoogleUser(user.providerData.some(
            (provider) => provider.providerId === 'google.com'
        ));
    }, [user]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const checkboxes = e.target.querySelectorAll('input[type="checkbox"]');
        const checkedIds = new Set();

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedIds.add(checkbox.id);
            }
        });

        if (checkedIds.size < 5) {
            alert("Please select at least 5 favorite genres.");
            return;
        }

        const newGenres = genres.map(genre => ({ ...genre, isChosen: checkedIds.has(genre.id) }));
        // set genres
        // const data = newGenres.toJS();
        // const docRef = doc(firestore, "users", user.uid);
        // await setDoc(docRef, data);
        // how to set displayName
        // await updateProfile(auth.currentUser, {
        //     displayName: `${form.firstName} ${form.lastName}`
        // })
        // password
        // try {
        //     await updatePassword(user, form.password)
        // } catch (error) {
        //     alert("error: ", error.message)
        // }

        setGenres(newGenres);
        setSaved(true);
    };

    return (
        <div id="settingsPage">
            <button className="button" onClick={() => navigate(-1)}>Back</button>
            <form id="settingForms" onSubmit={handleSubmit}>
                <h1>Settings</h1>
                <h1>First Name:</h1>
                <input id="firstName" name="firstName" className="settingsInput" type="text" defaultValue={name[0]} disabled={isGoogleUser} onChange={handleChange}></input>
                <h1>Last Name:</h1>
                <input id="lastName" name="lastName" className="settingsInput" type="text" defaultValue={name[1]} disabled={isGoogleUser} onChange={handleChange}></input>
                {/* figure how to change password */}
                <h1>Password:</h1>
                <input id="password" name="password" className="settingsInput" type="password" defaultValue={""} disabled={isGoogleUser} onChange={handleChange}></input>
                <h1>{`Email: ${user.email}`}</h1>
                <h1>Favourite Genres:</h1>
                {genres && genres.map(genre => (
                    <div key={genre.id}>
                        <input id={genre.id} type="checkbox" defaultChecked={genre.isChosen}></input>
                        <label className="genreLabels" htmlFor={genre.id}>{genre.genre}</label>
                    </div>
                ))}
                <input className="button" type="submit" value="Save Account Details" />
                {saved && <p id="savedText">Saved!</p>}
            </form>
            {/* display purchase history */}
            {/* {purHis && purHis.map(movie => (
                    <div className="movieBox" key={movie.id}>
                        <div className="movieCard">
                            <h1 className="movieTitle">{`${movie.title}`}</h1>
                            <img className="moviePoster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.id}`} />
                        </div>
                    </div>
                ))} */}
        </div>

    )
}

export default SettingsView;