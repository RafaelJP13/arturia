import React, { useEffect, useState } from "react";
import { listOrders, listOrderItems } from "../services/indexedDBClient";
import type { Order, OrderItem } from "../services/indexedDBClient";

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        listOrders().then(setOrders);
    }, []);

    const openOrder = async (id: number) => {
        setSelected(id);
        setItems(await listOrderItems(id));
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Orders</h2>

            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-5 border-r pr-4">
                    <h3 className="font-semibold mb-2">Saved Orders</h3>
                    {orders.map((o) => (
                        <div
                            key={o.id}
                            className="p-3 border rounded cursor-pointer hover:bg-neutral-100"
                            onClick={() => openOrder(o.id)}
                        >
                            <p className="font-medium">Order #{o.id}</p>
                            <p>Total: R$ {o.total.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                <div className="col-span-7">
                    {selected && (
                        <>
                            <h3 className="font-semibold mb-2">Order #{selected}</h3>
                            {items.map((i) => (
                                <div key={i.code} className="p-3 border rounded mb-2">
                                    {i.description} (x{i.quantity}) – R$ {i.price.toFixed(2)}
                                </div>
                            ))}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default OrdersPage;
