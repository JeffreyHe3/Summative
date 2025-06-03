import { useStoreContext } from "../Context";
import { useNavigate } from "react-router-dom"
import { useState } from 'react';
import "./CartView.css";

function CartView() {
    const [isCheckedout, setIsCheckedout] = useState(false);
    const { user, cart, setCart } = useStoreContext();
    const navigate = useNavigate();

    const handleRemoveFromCart = (value) => {
        const updatedCart = cart.delete(value.id);
        setCart(updatedCart);
        const vanillaCart = updatedCart.toJS();
        const parseCart = JSON.stringify(vanillaCart);
        localStorage.setItem(`${user.uid}-cart`, parseCart);
    };

    // debug
    const handleCheckout = async () => {
        const data = cart.toJS();
        const docRef = doc(firestore, "users", user.uid, "");
        await setDoc(docRef, data);
        setCart(null);
        localStorage.clear();
        setIsCheckedout(true);
    }

    return (
        <div id="cartPage">
            <button className="button" onClick={() => navigate(-1)}>Back</button>
            <h1 id="cTitle">Cart</h1>
            {cart.size == 0 ?
                <h1 id="emptyCart">Your cart is empty! Go buy some movies!</h1>
                :
                <div>
                    <div className="cartContainer">
                        {cart.entrySeq().map(([key, value]) => {
                            return (
                                <div className="cartItem" key={key}>
                                    {value.poster_path && <img src={`https://image.tmdb.org/t/p/w500${value.poster_path}`} alt={value.title} />}
                                    <h3>{value.title}</h3>
                                    <button className="button" onClick={() => handleRemoveFromCart(value)}>Remove</button>
                                </div>
                            )
                        })}
                    </div>
                    <button className="button" onClick={handleCheckout}>Checkout</button>
                    {isCheckedout && <p id="savedText">Thank you for your purchase!</p>}
                </div>
            }
        </div>
    );
}

export default CartView;