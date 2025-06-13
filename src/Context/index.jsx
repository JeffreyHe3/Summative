import { createContext, useContext, useState, useEffect } from "react";
import { Map } from "immutable";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from '../firebase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(Map());
    const [purHis, setPurHis] = useState(Map());
    const [genres, setGenres] = useState([
        { "name": "Action", "id": "28", "isChosen": false },
        { "name": "Adventure", "id": "12", "isChosen": false },
        { "name": "Animation", "id": "16", "isChosen": false },
        { "name": "Crime", "id": "80", "isChosen": false },
        { "name": "Family", "id": "10751", "isChosen": false },
        { "name": "Fantasy", "id": "14", "isChosen": false },
        { "name": "History", "id": "36", "isChosen": false },
        { "name": "Horror", "id": "27", "isChosen": false },
        { "name": "Mystery", "id": "9648", "isChosen": false },
        { "name": "Sci-Fi", "id": "878", "isChosen": false },
        { "name": "War", "id": "10752", "isChosen": false },
        { "name": "Western", "id": "37", "isChosen": false }
    ]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);

                async function getFromFireStore() {
                    const docRef = doc(firestore, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();

                        if (data?.purchaseHistory) {
                            const parsedPurchaseHistory = Object.entries(data.purchaseHistory).map(([key, value]) => [parseInt(key, 10), value]);
                            setPurHis(Map(parsedPurchaseHistory));
                        }

                        const preferedGenres = data.genrePreferences;
                        setGenres(genres.map(genre => ({ ...genre, isChosen: preferedGenres.includes(genre.id) })))
                    }
                }
                getFromFireStore();

                const storedCart = localStorage.getItem(`${user.uid}-cart`);
                if (storedCart) {
                    const parsedCart = JSON.parse(storedCart);
                    const cartWithIntKeys = Object.entries(parsedCart).map(([key, value]) => [parseInt(key, 10), value]);
                    setCart(Map(cartWithIntKeys));
                }
            } else {
                setUser(null);
                setCart(Map());
                setPurHis(Map());
                setGenres(prevGenres => prevGenres.map(genre => ({ ...genre, isChosen: false })));
            }
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <StoreContext.Provider value={{ user, setUser, purHis, setPurHis, cart, setCart, genres, setGenres }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}