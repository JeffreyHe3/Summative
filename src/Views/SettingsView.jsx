import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom"
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

function SettingsView() {
    const { user, genres, setGenres, purHis } = useStoreContext();
    const [saved, setSaved] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [fireGenres, setFireGenres] = useState([]);
    const [form, setForm] = useState({ firstName: '', lastName: '', oldPassword: '', newPassword: '', newPassword2: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.displayName) {
            const name = (user.displayName.split(' '));
            setForm(prev => ({ ...prev, firstName: name[0], lastName: name[1] }));
        }

        async function getFromFirestore() {
            const docRef = doc(firestore, "users", user.uid);
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            const preferedGenres = data.genrePreferences;
            setFireGenres(genres.map(genre => ({ ...genre, isChosen: preferedGenres.includes(genre.id) })))
        }
        getFromFirestore()

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

        const preferedGenres = genres.map(genre => ({ ...genre, isChosen: checkedIds.includes(genre.id) }));

        try {
            if (!isGoogleUser) {
                await updateProfile(auth.currentUser, {
                    displayName: `${form.firstName} ${form.lastName}`
                });
                await auth.currentUser.reload();

                if (form.oldPassword || form.newPassword || form.newPassword2) {
                    if (!form.oldPassword || !form.newPassword || !form.newPassword2) {
                        alert("Empty password fields");
                        return;
                    } else if (form.newPassword !== form.newPassword2) {
                        alert("New passwords are different");
                        return;
                    } else {
                        const credential = EmailAuthProvider.credential(user.email, form.oldPassword);
                        await reauthenticateWithCredential(auth.currentUser, credential);
                        await updatePassword(user, form.newPassword)
                    }
                }
            }

            const docRef = doc(firestore, "users", user.uid);
            const data = { genrePreferences: checkedIds, purchaseHistory: purHis.toJS() };
            await setDoc(docRef, data);

            setGenres(preferedGenres);
            setSaved(true);
        } catch (error) {
            switch (error.code) {
                case 'auth/weak-password':
                    alert('Password should be at least 6 characters.');
                    break;
                case 'auth/invalid-credential':
                    alert('Invalid password');
                    break;
                default:
                    alert('Error saving.');
            }
        }
    };

    return (
        <div id="settingsContainer">
            <div id="settingsPart">
                <button className="button" onClick={() => navigate(-1)}>Back</button>
                <form id="settingForms" onSubmit={handleSubmit}>
                    <h1>Settings</h1>
                    {isGoogleUser ?
                        <>
                            <p id="googleText">You can not change personal info because you are using a Google account.</p>
                            <h2>First Name:</h2>
                            <p>{form.firstName}</p>
                            <h2>Last Name:</h2>
                            <p>{form.lastName}</p>
                        </>
                        :
                        <>
                            <h2>Change First Name:</h2>
                            <input id="firstName" name="firstName" className="settingsInput" type="text" defaultValue={form.firstName} disabled={isGoogleUser} onChange={handleChange} required></input>
                            <h2>Change Last Name:</h2>
                            <input id="lastName" name="lastName" className="settingsInput" type="text" defaultValue={form.lastName} disabled={isGoogleUser} onChange={handleChange} required></input>
                            <div id="changePassword">
                                <h2>Change Password Here</h2>
                                <h2>Enter Old Password:</h2>
                                <input id="oldPassword" name="oldPassword" className="settingsInput" type="password" disabled={isGoogleUser} onChange={handleChange}></input>
                                <h2>Enter New Password:</h2>
                                <input id="newPassword" name="newPassword" className="settingsInput" type="password" disabled={isGoogleUser} onChange={handleChange}></input>
                                <h2>Re-enter New Password:</h2>
                                <input id="newPassword2" name="newPassword2" className="settingsInput" type="password" disabled={isGoogleUser} onChange={handleChange}></input>
                            </div>
                        </>
                    }
                    <h2>Email:</h2>
                    <p>{user.email}</p>
                    <h2>Change Viewable Genres:</h2>
                    {fireGenres && fireGenres.map(genre => (
                        <div key={genre.id}>
                            <input id={genre.id} type="checkbox" defaultChecked={genre.isChosen}></input>
                            <label className="genreLabels" htmlFor={genre.id}>{genre.name}</label>
                        </div>
                    ))}
                    <input className="button" type="submit" value="Save Account Details" />
                    {saved && <p id="savedText">Saved!</p>}
                </form>
            </div>
            <div id="purHisPart">
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