import axios from "axios";

export default function Cart({ cartItems, setShowCart }) {
    const calculateItemTotal = (price, quantity) => {
        return price * quantity;
    };

    const calculateCartTotal = () => {
        const total = cartItems.reduce((acc, item) => {
            return acc + calculateItemTotal(item.price, item.quantity);
        }, 0);
        return total;
    };

    const handleRemoveItem = async (itemId) => {
        // console.log(itemId);
        try {
            await axios.delete(`http://localhost:3200/api/cart/${itemId}`, {
                withCredentials: true,
            });
            // Remove the item from the UI after deletion
            setShowCart(false); // Close the cart modal after removing an item
        } catch (error) {
            console.log("Failed to remove item from cart", error);
        }
    };

    const handleUpdateQuantity = async (itemId, quantity) => {
        try {
            if (quantity === 0) {
                await handleRemoveItem(itemId);
            } else {
                await axios.put(
                    `http://localhost:3200/api/cart/${itemId}`,
                    { quantity },
                    { withCredentials: true }
                );
                // setShowCart(false)
            }
        } catch (error) {
            console.log("Failed to update quantity", error);
        }
    };

    const cartTotal = calculateCartTotal();
    const tax = cartTotal * 0.1;
    const totalWithTax = cartTotal + tax;

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg lg:w-1/2 sm:w-96">
                <h2 className="text-2xl font-semibold">Your Cart</h2>
                <div className="mt-4">
                    {cartItems.length === 0 ? (
                        <p>No items in cart</p>
                    ) : (
                        <div>
                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center py-2 border-b"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.item_name}
                                        className="w-12 h-12 object-cover rounded mr-2"
                                    />
                                    <div>
                                        <p>{item.item_name}</p>
                                        <p>₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(
                                                    item.item_id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            -
                                        </button>
                                        <p>{item.quantity}</p>
                                        <button
                                            onClick={() =>
                                                handleUpdateQuantity(
                                                    item.item_id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="px-2 py-1 bg-gray-200 rounded"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(item.item_id)
                                            }
                                            className="text-red-500 ml-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <p className="text-right">
                                        ₹
                                        {calculateItemTotal(
                                            item.price,
                                            item.quantity
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Total and Tax */}
                {cartItems.length > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-between">
                            <p className="font-semibold">Cart Total:</p>
                            <p>₹{cartTotal}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="font-semibold">Tax (10%):</p>
                            <p>₹{tax}</p>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <p>Total with Tax:</p>
                            <p>₹{totalWithTax}</p>
                        </div>
                    </div>
                )}

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={() => setShowCart(false)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
