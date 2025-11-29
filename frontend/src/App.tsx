// src/App.tsx
import { useState } from "react";
import { CatalogPage } from "./pages/CatalogPage";
import OrdersPage from "./pages/OrdersPage";
import ProjectInfoPage from "./pages/ProjectInfoPage";
import { CartProvider } from "./context/CartContext";
import { CartSidebar } from "./components/CartSidebar";

export default function App() {
    const [page, setPage] = useState<"catalog" | "orders" | "info">("catalog");

    return (
        <CartProvider>
            <div className="min-h-screen bg-neutral-100 p-6 grid grid-cols-12 gap-6">

                <nav className="col-span-12 flex gap-4 mb-4 text-lg font-medium">
                    <button onClick={() => setPage("catalog")}>Catalog</button>
                    <button onClick={() => setPage("orders")}>Orders</button>
                    <button onClick={() => setPage("info")}>Project Info</button>
                </nav>

                <main className="col-span-9">
                    {page === "catalog" && <CatalogPage />}
                    {page === "orders" && <OrdersPage />}
                    {page === "info" && <ProjectInfoPage />}
                </main>

                <aside className="col-span-3">
                    <CartSidebar />
                </aside>

            </div>
        </CartProvider>
    );
}
