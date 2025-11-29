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
            setMessage(`Order #${orderId} created successfully!`);
        } catch (err) {
            console.error(err);
            setMessage("Failed to create order. Try again.");
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(""), 3000); // limpa a mensagem depois de 3s
        }
    };

    return (
        <aside className="bg-white p-4 rounded shadow w-full">
            <h3 className="font-bold mb-2">Cart</h3>

            {cartItems.length === 0 && <p className="text-sm text-gray-500">Empty cart</p>}

            {cartItems.map((item) => (
                <div key={item.code} className="flex justify-between border-b py-2">
                    <span>{item.description} (x{item.quantity})</span>
                    <span>{formatCurrency(item.price)}</span>
                </div>
            ))}

            <div className="mt-3 border-t pt-3 space-y-2">
                <div className="flex justify-between font-semibold mb-2">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                </div>

                {/* Renderiza Buy Now somente se houver itens */}
                {cartItems.length > 0 && (
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Buy Now"}
                    </button>
                )}

                {/* Botão de limpar carrinho sempre visível */}
                <button
                    onClick={clearCart}
                    className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
                >
                    Clear Cart
                </button>

                {/* Mensagem de feedback */}
                {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
            </div>
        </aside>
    );
};
