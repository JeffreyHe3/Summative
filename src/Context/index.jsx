import { createContext, useContext, useState, useEffect } from "react";
import { Map } from "immutable";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(Map());
    const [purHis, setPurHis] = useState(Map());
    const [fGenre, setFGenre] = useState([]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                // get from firestore purHis and fGenre
                // update cart from local storage
                const storedCart = localStorage.getItem(`${user.uid}-cart`);
                if (storedCart) {
                    const parsedCart = JSON.parse(storedCart);
                    setCart(Map(parsedCart));
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
        <StoreContext.Provider value={{ user, setUser, purHis, setPurHis, cart, setCart, fGenre, setFGenre }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}