// src/services/websql/websqlClient.ts
// WebSQL client - fully typed for TypeScript projects
// Note: WebSQL is available only in some browsers. This adapter throws a clear error
// if WebSQL isn't available. For production you might want to add an IndexedDB fallback.
interface Database {
    transaction(
        callback: (tx: SQLTransaction) => void,
        errorCallback?: (err: SQLError) => void,
        successCallback?: () => void
    ): void;
}

interface SQLTransaction {
    executeSql(
        sqlStatement: string,
        args?: any[],
        callback?: (tx: SQLTransaction, result: SQLResultSet) => void,
        errorCallback?: (tx: SQLTransaction, err: SQLError) => void
    ): void;
}

interface SQLResultSet {
    rows: {
        length: number;
        item: (index: number) => any;
    };
    insertId?: number;
}

interface SQLError {
    code: number;
    message: string;
}


export interface Order {
    id: number;
    total: number;
    created_at: string;
}

export interface OrderItem {
    order_id: number;
    code: string;
    description: string;
    price: number;
    quantity: number;
}

/**
 * Extend global Window typing when lib.dom doesn't include openDatabase
 */
declare global {
    interface Window {
        openDatabase?: (
            name: string,
            version: string,
            desc: string,
            size: number
        ) => Database;
    }
}

/**
 * Open WebSQL database (throws if not supported)
 */
export const openDB = (): Database => {
    if (typeof window === "undefined" || !window.openDatabase) {
        throw new Error("WebSQL is not supported in this environment");
    }
    // name, version, displayName, estimatedSize
    return window.openDatabase("arturia_db", "1.0", "Arturia Orders DB", 5 * 1024 * 1024);
};

/**
 * Initialize DB tables. Safe to call multiple times.
 */
export const initDB = (): void => {
    const db = openDB();
    db.transaction((tx: any) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total REAL,
        created_at TEXT
      )`,
            []
        );
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS order_items (
        order_id INTEGER,
        code TEXT,
        description TEXT,
        price REAL,
        quantity INTEGER
      )`,
            []
        );
    });
}

/**
 * Insert a new order with total and returns the inserted order id.
 */
export const insertOrder = (total: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        try {
            const db = openDB();
            const createdAt = new Date().toISOString();

            db.transaction(
                (tx: any) => {
                    tx.executeSql(
                        `INSERT INTO orders (total, created_at) VALUES (?, ?)`,
                        [total, createdAt],
                        (_: any, result: any) => {
                            // result.insertId is where WebSQL returns last insert id
                            const insertId = typeof result.insertId === "number" ? result.insertId : Number(result.insertId);
                            resolve(insertId);
                        },
                        (_: any, err: any) => {
                            // returning false would rollback; here we reject the promise
                            reject(err);
                            return false;
                        }
                    );
                },
                (txErr: any) => {
                    reject(txErr);
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Insert multiple order items for a given order id.
 */
export const insertOrderItems = (orderId: number, items: Array<Omit<OrderItem, "order_id">>): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            const db = openDB();
            db.transaction(
                (tx: any) => {
                    for (const item of items) {
                        tx.executeSql(
                            `INSERT INTO order_items (order_id, code, description, price, quantity) VALUES (?, ?, ?, ?, ?)`,
                            [orderId, item.code, item.description, item.price, item.quantity]
                        );
                    }
                },
                (txErr: any) => {
                    reject(txErr);
                },
                () => {
                    resolve();
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * List all orders (newest first).
 */
export const listOrders = (): Promise<Order[]> => {
    return new Promise((resolve, reject) => {
        try {
            const db = openDB();
            db.transaction(
                (tx: any) => {
                    tx.executeSql(
                        `SELECT * FROM orders ORDER BY id DESC`,
                        [],
                        (_: any, result: any) => {
                            const rows: Order[] = [];
                            for (let i = 0; i < result.rows.length; i++) {
                                rows.push(result.rows.item(i) as Order);
                            }
                            resolve(rows);
                        },
                        (_: any, err: any) => {
                            reject(err);
                            return false;
                        }
                    );
                },
                (txErr: any) => reject(txErr)
            );
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * List items for a specific order.
 */
export const listOrderItems = (orderId: number): Promise<OrderItem[]> => {
    return new Promise((resolve, reject) => {
        try {
            const db = openDB();
            db.transaction(
                (tx: any) => {
                    tx.executeSql(
                        `SELECT * FROM order_items WHERE order_id = ?`,
                        [orderId],
                        (_: any, result: any) => {
                            const rows: OrderItem[] = [];
                            for (let i = 0; i < result.rows.length; i++) {
                                rows.push(result.rows.item(i) as OrderItem);
                            }
                            resolve(rows);
                        },
                        (_: any, err: any) => {
                            reject(err);
                            return false;
                        }
                    );
                },
                (txErr: any) => reject(txErr)
            );
        } catch (err) {
            reject(err);
        }
    });
};

/**
 * Optional helper: save a full order (total + items) in a single flow.
 * Returns the created order id.
 */
export const saveOrder = async (
    total: number,
    items: Array<Omit<OrderItem, "order_id">>
): Promise<number> => {
    // insert order and items in sequence; if item insertion fails, the order will exist.
    // For transactional safety you'd need a different DB. WebSQL transactions above
    // already ensure each group executes as one transaction, but here we do two transactions.
    const orderId = await insertOrder(total);
    await insertOrderItems(orderId, items);
    return orderId;
};

// Initialize DB tables when this module is imported (safe to call multiple times)
try {
    if (typeof window !== "undefined" && window.openDatabase) {
        initDB();
    }
} catch {
    // ignore init errors at import time (e.g., server-side build), they will surface when functions are used
}
