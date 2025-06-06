import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom"
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
// 
function SettingsView() {
    const { user, setGenres, genres, purHis } = useStoreContext();
    const [saved, setSaved] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', oldPassword: '', newPassword: '', newPassword2: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.displayName) {
            const name = (user.displayName.split(' '));
            setForm({ ...form, firstName: name[0], lastName: name[1] })
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

                if (form.oldPassword || form.newPassword || form.newPassword2) {
                    if (!form.oldPassword || !form.newPassword || !form.newPassword2) {
                        alert("Empty password fields");
                        return;
                    } else if (form.newPassword != form.newPassword2) {
                        alert("New passwords are different");
                        return;
                    } else {
                        const credential = EmailAuthProvider.credential(user.email, form.oldPassword);
                        await reauthenticateWithCredential(auth.currentUser, credential);
                        await updatePassword(user, form.newPassword)
                    }
                }
            }

            // const data = { genrePreferences: checkedIds, purchaseHistory: purHis.toJS() };
            // const docRef = doc(firestore, "users", user.uid);
            // await setDoc(docRef, data);

            setGenres(checkedGenres);
            setSaved(true);
        } catch (error) {
            switch (error.code) {
                case 'auth/weak-password':
                    alert('Password should be at least 6 characters.');
                    break;
                    case 'auth/invalid-credential':
                    alert('Invalid login');
                    break;
                default:
                    console.error("Error creating user:", error);
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
                    <h1>Change First Name:</h1>
                    <input id="firstName" name="firstName" className="settingsInput" type="text" defaultValue={form.firstName} disabled={isGoogleUser} onChange={handleChange} required></input>
                    <h1>Change Last Name:</h1>
                    <input id="lastName" name="lastName" className="settingsInput" type="text" defaultValue={form.lastName} disabled={isGoogleUser} onChange={handleChange} required></input>
                    <div id="changePassword">
                        <h1>Change Password Here</h1>
                        <h1>Enter Old Password:</h1>
                        <input id="oldPassword" name="oldPassword" className="settingsInput" type="password" disabled={isGoogleUser} onChange={handleChange}></input>
                        <h1>Enter New Password:</h1>
                        <input id="newPassword" name="newPassword" className="settingsInput" type="password" disabled={isGoogleUser} onChange={handleChange}></input>
                        <h1>Re-enter New Password:</h1>
                        <input id="newPassword2" name="newPassword2" className="settingsInput" type="password" disabled={isGoogleUser} onChange={handleChange}></input>
                    </div>
                    <h1>{`Email: ${user.email}`}</h1>
                    <h1>Change Viewable Genres:</h1>
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