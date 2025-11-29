import React from "react";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types/product";

const sample: Product[] = [
    { code: "P001", description: "Wireless Headphones", price: 199.9 },
    { code: "P002", description: "Mechanical Keyboard", price: 129.0 },
    { code: "P003", description: "USB-C Hub", price: 49.9 },
];

export const CatalogPage: React.FC = () => (
    <div className="grid grid-cols-3 gap-4">
        {sample.map((p) => (
            <ProductCard key={p.code} product={p} />
        ))}
    </div>
);
