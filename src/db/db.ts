import * as idb from "idb";

export const DB_NAME = "todo_data_base";
export const DB_VERSION = 2;
export const INDEXES = [
  {
    name: "idx_done",
    key: "done",
    unique: false,
  },
];

class DB {
  private static stores = new Set<string>();

  static async openDB(STORE_NAME: string): Promise<idb.IDBPDatabase> {
    // Add store to the set
    this.stores.add(STORE_NAME);

    return idb.openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create all stores that don't exist
        for (const storeName of DB.stores) {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, {
              keyPath: "id",
              autoIncrement: false,
            });

            // Add indexes if needed
            if (INDEXES.length > 0) {
              INDEXES.forEach((index) => {
                store.createIndex(index.name, index.key, {
                  unique: index.unique,
                });
              });
            }

            console.log(`Store ${storeName} has been created`);
          }
        }
      },
      blocked() {
        console.log("Database upgrade was blocked");
      },
      blocking() {
        console.log("Database is blocking an upgrade");
      },
    });
  }
}

export { DB };
