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
            <div className="min-h-screen bg-neutral-100 p-4 flex flex-col">
                {/* Menu horizontal compacto */}
                <nav className="flex gap-2 mb-4 text-lg font-medium bg-white p-2 rounded shadow-sm">
                    <button
                        className={`px-3 py-1 rounded hover:bg-gray-200 transition ${page === "catalog" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setPage("catalog")}
                    >
                        Catalog
                    </button>
                    <button
                        className={`px-3 py-1 rounded hover:bg-gray-200 transition ${page === "orders" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setPage("orders")}
                    >
                        Orders
                    </button>
                </nav>

                {/* Conteúdo principal com sidebar */}
                <div className="flex gap-4 flex-1">
                    <main className="flex-1">
                        {page === "catalog" && <CatalogPage />}
                        {page === "orders" && <OrdersPage />}
                        {page === "info" && <ProjectInfoPage />}
                    </main>

                    <aside className="w-80">
                        <CartSidebar />
                    </aside>
                </div>
            </div>
        </CartProvider>
    );
}
