import * as idb from 'idb';

export const STORE_NAME = 'todos';
export const DB_NAME = 'todo_db';
export const DB_VERSION = 1;
export const TXN_WRITE = 'readwrite';
export const INDEXES = [
    {
        name: 'idx_done',
        key: 'done',
        unique: false
    }
];

class DB {
    static openDB(): Promise<idb.IDBPDatabase> {
        return idb.openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (db.objectStoreNames.contains(STORE_NAME)) {
                    db.deleteObjectStore(STORE_NAME);
                }

                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                if (INDEXES.length > 0) {
                    INDEXES.forEach((index) => {
                        store.createIndex(index.name, index.key, { unique: index.unique });
                    });
                }
                store.transaction.oncomplete = () => {
                    console.log(`Store ${STORE_NAME} has been created`);
                };
                store.transaction.onerror = (e) => {
                    console.log(e);
                }
            },
        });
    }
}

export { DB };