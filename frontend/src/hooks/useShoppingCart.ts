import { useCart } from "../context/CartContext";

export const useShoppingCart = () => {
    const { items, addItem, removeItem, clearCart } = useCart();

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return { cartItems: items, addItem, removeItem, clearCart, total };
};
