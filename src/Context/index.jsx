import { createContext, useContext, useState, useEffect } from "react";
import { Map } from "immutable";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from '../firebase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(Map());
    const [purHis, setPurHis] = useState(Map());
    const [genres, setGenres] = useState([
        { "genre": "Action", "id": "28", "isChosen": false },
        { "genre": "Adventure", "id": "12", "isChosen": false },
        { "genre": "Animation", "id": "16", "isChosen": false },
        { "genre": "Crime", "id": "80", "isChosen": false },
        { "genre": "Family", "id": "10751", "isChosen": false },
        { "genre": "Fantasy", "id": "14", "isChosen": false },
        { "genre": "History", "id": "36", "isChosen": false },
        { "genre": "Horror", "id": "27", "isChosen": false },
        { "genre": "Mystery", "id": "9648", "isChosen": false },
        { "genre": "Sci-Fi", "id": "878", "isChosen": false },
        { "genre": "War", "id": "10752", "isChosen": false },
        { "genre": "Western", "id": "37", "isChosen": false }
    ]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                // get from firestore purHis and genres
                // const docRef = doc(firestore, "users", user.uid);
                // async function getFromFireStore() {
                //     const docSnap = await getDoc(docRef);
                //     setPurHis(docRef.purHis);
                //     setGenres(docRef.genres);
                // }
                // getFromFireStore();
                // update cart from local storage

                // rethink cart workings (why strings? why not saved in cart?)
                const storedCart = localStorage.getItem(`${user.uid}-cart`);
                if (storedCart) {
                    const parsedCart = JSON.parse(storedCart);
                    setCart(Map(parsedCart));
                    console.log(cart);
                }
                console.log("Have a user");
            } else {
                setUser(null);
                console.log("Do not have a user");
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