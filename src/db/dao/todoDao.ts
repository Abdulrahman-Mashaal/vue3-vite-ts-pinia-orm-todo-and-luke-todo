// import { DB, STORE_NAME, TXN_WRITE } from '../db';
// import Todo from "@/models/Todo";

// class TodoDao {
//     // async add(todo: Todo): Promise<Todo | undefined> {
//     //     const db = await DB.openDB();
//     //     const todoKey = await db.add(STORE_NAME, todo);
//     //     return db.get(STORE_NAME, todoKey);
//     // }
//     /*
//     // Example usage:
//     add({ title: 'New Todo', completed: false })
//     .then(todos => {
//         console.log('Todos after adding:', todos);
//     })
//     .catch(error => {
//         console.error('Error adding todo:', error);
//     });
//     */
//     async add(todo: Todo): Promise<Todo[]> {
//         try {
//         const db = await DB.openDB();
//         await db.add(STORE_NAME, todo);
//         const updatedTodos = await db.getAll(STORE_NAME);
//         return updatedTodos;
//         } catch (error) {
//             console.error('Error adding todo:', error);
//             return Promise.reject(error);
//         }
//     }

//     async getIndexValues(indexKey: string): Promise<string[]> {
//         const db = await DB.openDB();
//         let cursor = await db
//             .transaction(STORE_NAME)
//             .objectStore(STORE_NAME)
//             .index(indexKey)
//             .openKeyCursor(null, 'nextunique');

//         const values: string[] = [];
//         while (cursor) {
//             values.push(cursor.key as string);
//             cursor = await cursor.continue();
//         }

//         return values;
//     }

//     async getAll(filter?: { indexKey: string; indexValue?: string }): Promise<Todo[]> {
//         try {
//             const db = await DB.openDB();
//             const store = db.transaction([STORE_NAME]).objectStore(STORE_NAME);
//             if (filter?.indexValue) {
//                 return store.index(filter.indexKey).getAll(filter.indexValue);
//             }
//             return store.getAll();
//         } catch (error) {
//             console.error('Error getting todos:', error);
//             return Promise.reject(error);
//         }
//     }

//     async get(key: string): Promise<Todo | undefined> {
//         const db = await DB.openDB();
//         const store = db.transaction([STORE_NAME]).objectStore(STORE_NAME);
//         return store.get(key);
//     }

//     async delete(id: string): Promise<void> {
//         const db = await DB.openDB();
//         return db.delete(STORE_NAME, id);
//     }

//     async update(todo: Todo): Promise<Todo | undefined> {
//         const db = await DB.openDB();
//         const store = db.transaction([STORE_NAME], TXN_WRITE).objectStore(STORE_NAME);
//         await store.put(todo);
//         return this.get(todo.id); // Return the updated todo
//     }
// }

// const todoDao = new TodoDao();

// export default todoDao;