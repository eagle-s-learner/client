import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import ShowAllItems from "../pages/ShowAllItems";
import { AuthContext } from "../UserContext";
import Cart from "./Cart";

export default function HomePage() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCart, setShowCart] = useState(false);

    const [cartItems, setCartItems] = useState([]);

    const userCtx = useContext(AuthContext);

    useEffect(() => {
        async function getItems() {
            try {
                const response = await axios.get(
                    "http://localhost:3200/api/items/"
                );

                if (response.status == 200) {
                    setItems(response.data);
                    setIsLoading(true);
                }
            } catch (error) {
                console.log(error);
            }
        }

        getItems();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:3200/api/logout", {}, { withCredentials: true });
            userCtx.setLogin(false);
            userCtx.setUserInfo({});
        } catch (error) {
            console.log("Logout failed", error);
        }
    };

    useEffect(() => {
        if (showCart && userCtx.login) {
            async function getCartItems() {
                try {
                    const response = await axios.get(
                        "http://localhost:3200/api/cart", { withCredentials: true }
                    );
                    if (response.status === 200) {
                        setCartItems(response.data);
                    }
                } catch (error) {
                    console.log("Failed to fetch cart items", error);
                }
            }

            getCartItems();
        }
    }, [showCart, userCtx.login]);

    return (
        <div>
            {!isLoading && <h1 className="text-gray-500 w-fit mx-auto">Loading..</h1>}
            {isLoading && (
                <div>
                    <div className="bg-gray-300 p-4">
                    {userCtx.login ? (
                            <div className="flex justify-around items-center">
                                <h1 className="text-2xl font-semibold text-slate-700">
                                    Cart Processing System
                                </h1>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                    onClick={() => setShowCart(true)}
                                >
                                    Cart
                                </button>
                                <button
                                    className=" text-black px-4 py-2 underline"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <h1 className="text-2xl font-semibold text-slate-700 text-center">
                                Cart Processing System
                            </h1>
                        )}
                    </div>
                    <ShowAllItems items={items}/>
                </div>
            )}
            {showCart && <Cart cartItems={cartItems} setShowCart={setShowCart}/>}
        </div>
    );
}
