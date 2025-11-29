import React, { useState } from "react";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { formatCurrency } from "../utils/formatters";
import { saveOrder } from "../services/indexedDBClient";

export const CartSidebar: React.FC = () => {
    const { cartItems, total, clearCart } = useShoppingCart();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;
        setLoading(true);
        try {
            const orderId = await saveOrder(
                total,
                cartItems.map(({ code, description, price, quantity }) => ({
                    code,
                    description,
                    price,
                    quantity,
                }))
            );
            clearCart();
            setMessage(`✅ Order #${orderId} created successfully!`);
        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to create order. Try again.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(""), 3000); // limpa a mensagem depois de 3s
        }
    };

    return (
        <aside className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-3">
            <h3 className="font-bold text-lg border-b pb-2">Cart</h3>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
                {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-2">Empty cart</p>
                ) : (
                    <div className="space-y-2">
                        {cartItems.map((item) => (
                            <div key={item.code} className="flex justify-between items-center border-b py-1">
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.description}</span>
                                    <span className="text-gray-500 text-sm">(x{item.quantity})</span>
                                </div>
                                <span className="font-semibold">{formatCurrency(item.price)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-3 border-t pt-3 space-y-2">
                <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>

                <button
                    onClick={clearCart}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Clear Cart
                </button>

                <button
                    onClick={handleCheckout}
                    disabled={loading || cartItems.length === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Buy Now"}
                </button>

                {message && (
                    <p className="text-sm text-center text-gray-700 mt-1">
                        {message}
                    </p>
                )}
            </div>
        </aside>
    );
};
