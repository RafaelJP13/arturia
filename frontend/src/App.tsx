import { useState } from "react";
import { CatalogPage } from "./pages/CatalogPage";
import OrdersPage from "./pages/OrdersPage";
import { CartProvider } from "./context/CartContext";
import { CartSidebar } from "./components/CartSidebar";

export default function App() {
    const [page, setPage] = useState<"Produtos" | "Pedidos">("Produtos");

    return (
        <CartProvider>
            <div className="min-h-screen bg-neutral-100 p-4 flex flex-col">
                <nav className="flex gap-2 mb-4 text-lg font-medium bg-white p-2 rounded shadow-sm cursor-pointer">
                    <button
                        className={`px-3 py-1 rounded hover:bg-gray-200 transition ${page === "Produtos" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setPage("Produtos")}
                    >
                        Produtos
                    </button>
                    <button
                        className={`px-3 py-1 rounded hover:bg-gray-200 transition cursor-pointer ${page === "Pedidos" ? "bg-gray-200" : ""
                            }`}
                        onClick={() => setPage("Pedidos")}
                    >
                        Pedidos
                    </button>
                </nav>

                <div className="flex gap-4 flex-1">
                    <main className="flex-1">
                        {page === "Produtos" && <CatalogPage />}
                        {page === "Pedidos" && <OrdersPage />}
                    </main>

                    <aside className="w-80">
                        <CartSidebar />
                    </aside>
                </div>
            </div>
        </CartProvider>
    );
}
