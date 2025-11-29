import React from "react";
import type { Product } from "../types/product";
import { useShoppingCart } from "../hooks/useShoppingCart";
import { formatCurrency } from "../utils/formatters";

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addItem } = useShoppingCart();

    return (
        <div className="border p-4 rounded bg-white shadow-sm">
            <h3 className="font-semibold text-lg">{product.description}</h3>
            <p className="text-sm text-gray-500">{product.code}</p>
            <p className="mt-2 font-bold">{formatCurrency(product.price)}</p>

            <button
                className="mt-3 px-4 py-2 bg-black text-white rounded"
                onClick={() => addItem(product)}
            >
                Comprar
            </button>
        </div>
    );
};
