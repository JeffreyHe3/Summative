import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom"
import { useState } from 'react';
import { doc, setDoc } from "firebase/firestore";
import { firestore } from '../firebase';
import { Map } from "immutable";
import "./CartView.css";

function CartView() {
    const [isCheckedout, setIsCheckedout] = useState(false);
    const { user, cart, setCart, genres, purHis, setPurHis } = useStoreContext();
    const navigate = useNavigate();

    const handleRemoveFromCart = (key) => {
        const updatedCart = cart.delete(key);
        setCart(updatedCart);
        const vanillaCart = updatedCart.toJS();
        const parseCart = JSON.stringify(vanillaCart);
        localStorage.setItem(`${user.uid}-cart`, parseCart);
    };

    const handleCheckout = async () => {
        try {
            const checkedIds = genres.filter(genre => genre?.isChosen).map(genre => genre.id);
            const newPurHis = purHis.merge(cart);
            const docRef = doc(firestore, "users", user.uid);
            const data = { genrePreferences: checkedIds, purchaseHistory: newPurHis.toJS() };
            await setDoc(docRef, data);
            setPurHis(newPurHis);

            setCart(Map());
            localStorage.removeItem(`${user.uid}-cart`);

            setIsCheckedout(true);
            alert("Thank you for your purchase!");
        } catch (error) {
            alert("Error saving");
        }
    }

    return (
        <div id="cartPage">
            <button className="button" onClick={() => navigate(-1)}>Back</button>
            <h1 id="cTitle">Cart</h1>
            {cart.size === 0 ?
                <h1 id="emptyCart">Your cart is empty! Go buy some movies!</h1>
                :
                <div>
                    <div className="cartContainer">
                        {cart.entrySeq().map(([key, value]) => {
                            return (
                                <div className="cartItem" key={key}>
                                    {value.poster_path && <img src={`https://image.tmdb.org/t/p/w500${value.poster_path}`} onClick={() => navigate(`/movies/details/${key}`)} alt={value.title} />}
                                    <h3>{value.title}</h3>
                                    <button className="button" onClick={() => handleRemoveFromCart(key)}>Remove</button>
                                </div>
                            )
                        })}
                    </div>
                    <button className="button" onClick={handleCheckout}>Checkout</button>
                </div>
            }
            {isCheckedout && <p id="savedText">Thank you for your purchase!</p>}
        </div>
    );
}

export default CartView;