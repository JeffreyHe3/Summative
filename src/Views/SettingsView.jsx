import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom"

function SettingsView() {
    const { user, setFGenre, fGenre, purHis } = useStoreContext();
    const [saved, setSaved] = useState(false);
    const [name, setName] = useState([]);
    const [form, setForm] = useState({ firstName: '', lastName: '', password: '' });
    const navigate = useNavigate();
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

    useEffect(() => {
        if (user && user.displayName) {
            setName(user.displayName.split(' '));
        }
        // check if user is signed in with google
        const isGoogleUser = user.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );
    }, [user]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const checkedGenres = [];
        const checkboxes = e.target.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedGenres.push(Number(checkbox.id));
            }
        });

        if (checkedGenres.length < 5) {
            alert("Please select at least 5 favorite genres.");
            return;
        }
// set fGenres
const data = checkedGenres.toJS();
        const docRef = doc(firestore, "users", user.uid);
        await setDoc(docRef, data);
        // how to set displayName
await updateProfile(auth.currentUser, {
  displayName: `${form.firstName} ${form.lastName}`
})
// password
            try {
await updatePassword(user, form.password)
            } catch(error){
alert("error: ", error.message)
            }

        setFGenre(checkedGenres);

        setSaved(true);
    };

    return (
        <div id="settingsPage">
            <button className="button" onClick={() => navigate(-1)}>Back</button>
            <form id="settingForms" onSubmit={handleSubmit}>
                <h1>Settings</h1>
                <h1>First Name:</h1>
                <input id="firstName" name="firstName" className="settingsInput" type="text" defaultValue={name[0]} disabled={!isGoogleUser} onChange={handleChange}></input>
                <h1>Last Name:</h1>
                <input id="lastName" name="lastName" className="settingsInput" type="text" defaultValue={name[1]} disabled={!isGoogleUser} onChange={handleChange}></input>
                {/* figure how to change password */}
                <h1>Password:</h1>
                <input id="password" name="password" className="settingsInput" type="password" defaultValue={""} disabled={!isGoogleUser} onChange={handleChange}></input>
                <h1>{`Email: ${user.email}`}</h1>
                <h1>Favourite Genres:</h1>
                {/* fix setting default checked */}
                {genreList && genreList.map(genre => (
                    <div key={genre.id}>
                        <input id={genre.id} type="checkbox" defaultChecked={fGenre.includes(genre.id)}></input>
                        <label className="genreLabels" htmlFor={genre.id}>{genre.genre}</label>
                    </div>
                ))}
                <input className="button" type="submit" value="Save Account Details" />
                {/* display purchase history */}
                {purHis && purHis.map(movie => (
                    <div className="movieBox" key={movie.id}>
                        <div className="movieCard">
                            <h1 className="movieTitle">{`${movie.title}`}</h1>
                            <img className="moviePoster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={`${movie.id}`} />
                        </div>
                    </div>
                ))}
                {saved && <p id="savedText">Saved!</p>}
            </form>
        </div>

    )
}

export default SettingsView;