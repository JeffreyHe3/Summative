import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom"
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
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

        setIsGoogleUser(user.providerData.some(
            (provider) => provider.providerId === 'google.com'
        ));
    }, [user]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const checkboxes = e.target.querySelectorAll('input[type="checkbox"]');
        const checkedIds = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedIds.push(checkbox.id);
            }
        });

        if (checkedIds.length < 5) {
            alert("Please select at least 5 favorite genres.");
            return;
        }

        const checkedGenres = genres.map(genre => ({ ...genre, isChosen: checkedIds.includes(genre.id) }));

        try {
            if (!isGoogleUser) {
                await updateProfile(auth.currentUser, {
                    displayName: `${form.firstName} ${form.lastName}`
                });
                await auth.currentUser.reload();
            }

            const data = {genrePreferences: checkedIds, purchaseHistory: purHis.toJS()};
            const docRef = doc(firestore, "users", user.uid);
            await setDoc(docRef, data);

            // password
            // if (form.password){
            //     await updatePassword(user, form.password)
            //     alert("error: ", error.message)
            // }

            setGenres(checkedGenres);
            setSaved(true);
            console.log("User data saved successfully!");
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('Email already in use.');
                    break;
                case 'auth/weak-password':
                    alert('Password should be at least 6 characters.');
                    break;
                default:
                    console.error("Error creating user:", error);
                    alert('Registration error.');
            }
        }
    };

    return (
        <div id="settingsContainer">
            <div id="settingsPart">
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
                    <h1>Viewable Genres:</h1>
                    {genres && genres.map(genre => (
                        <div key={genre.id}>
                            <input id={genre.id} type="checkbox" defaultChecked={genre.isChosen}></input>
                            <label className="genreLabels" htmlFor={genre.id}>{genre.genre}</label>
                        </div>
                    ))}
                    <input className="button" type="submit" value="Save Account Details" />
                    {saved && <p id="savedText">Saved!</p>}
                </form>
            </div>
            <div className="purHisPart">
                <h1>Purchase History</h1>
                {purHis.entrySeq().map(([key, value]) => {
                    return (
                        <div className="cartItem" key={key}>
                            {value.poster_path && <img src={`https://image.tmdb.org/t/p/w500${value.poster_path}`} onClick={() => navigate(`/movies/details/${key}`)} alt={value.title} />}
                            <h3>{value.title}</h3>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SettingsView;