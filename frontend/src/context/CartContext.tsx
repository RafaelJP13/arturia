import React, { createContext, useContext, useState } from "react";
import type { Product } from "../types/product";

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (p: Product) => void;
    removeItem: (code: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (p: Product) => {
        setItems((prev) => {
            const found = prev.find((i) => i.code === p.code);
            if (found) {
                return prev.map((i) =>
                    i.code === p.code ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...p, quantity: 1 }];
        });
    };

    const removeItem = (code: string) => {
        setItems((prev) => prev.filter((i) => i.code !== code));
    };

    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};
