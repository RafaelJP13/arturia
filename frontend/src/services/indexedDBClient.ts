export interface Order {
    id?: number;
    total: number;
    created_at: string;
}

export interface OrderItem {
    order_id?: number;
    code: string;
    description: string;
    price: number;
    quantity: number;
}

const DB_NAME = "arturia_db";
const DB_VERSION = 1;
const ORDERS_STORE = "orders";
const ITEMS_STORE = "order_items";

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(ORDERS_STORE)) {
                db.createObjectStore(ORDERS_STORE, { keyPath: "id", autoIncrement: true });
            }
            if (!db.objectStoreNames.contains(ITEMS_STORE)) {
                db.createObjectStore(ITEMS_STORE, { keyPath: "id", autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });

    return dbPromise;
};

export const saveOrder = async (total: number, items: OrderItem[]): Promise<number> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction([ORDERS_STORE, ITEMS_STORE], "readwrite");
        const ordersStore = tx.objectStore(ORDERS_STORE);
        const itemsStore = tx.objectStore(ITEMS_STORE);

        const created_at = new Date().toISOString();
        const orderRequest = ordersStore.add({ total, created_at });

        orderRequest.onsuccess = () => {
            const orderId = orderRequest.result as number;
            for (const item of items) {
                itemsStore.add({ ...item, order_id: orderId });
            }
            tx.oncomplete = () => resolve(orderId);
            tx.onerror = () => reject(tx.error);
        };

        orderRequest.onerror = () => reject(orderRequest.error);
    });
};

export const listOrders = async (): Promise<Order[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(ORDERS_STORE, "readonly");
        const store = tx.objectStore(ORDERS_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result as Order[]);
        request.onerror = () => reject(request.error);
    });
};

// Listar itens de um pedido
export const listOrderItems = async (orderId: number): Promise<OrderItem[]> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(ITEMS_STORE, "readonly");
        const store = tx.objectStore(ITEMS_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
            const items = request.result.filter((i: any) => i.order_id === orderId);
            resolve(items as OrderItem[]);
        };
        request.onerror = () => reject(request.error);
    });
};
