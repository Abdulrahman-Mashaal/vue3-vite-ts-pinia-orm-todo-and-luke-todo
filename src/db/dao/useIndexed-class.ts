import { DB } from "../db";
import { Model } from "pinia-orm";

class ModelDao<T extends typeof Model> {
  ModelClass: T;
  STORE_NAME: string;
  constructor(ModelClass: T) {
    this.ModelClass = ModelClass;
    this.STORE_NAME = ModelClass.entity;
  }

  // async add(todo: Todo): Promise<Todo | undefined> {
  //     const db = await DB.openDB();
  //     const todoKey = await db.add(STORE_NAME, todo);
  //     return db.get(STORE_NAME, todoKey);
  // }
  /*
    // Example usage:
    add({ title: 'New Todo', completed: false })
    .then(todos => {
        console.log('Todos after adding:', todos);
    })
    .catch(error => {
        console.error('Error adding todo:', error);
    });
    */
  async getAll(filter?: {
    indexKey: string;
    indexValue?: string;
  }): Promise<InstanceType<T>[]> {
    try {
      console.log('STORE_NAME:', this.STORE_NAME);
      const db = await DB.openDB(this.STORE_NAME);
      console.log('db:', db);
      const store = db
        .transaction(this.STORE_NAME, "readonly")
        .objectStore(this.STORE_NAME);
      if (filter?.indexValue) {
        return store.index(filter.indexKey).getAll(filter.indexValue);
      }
      return store.getAll();
    } catch (error) {
      console.error("Error getting todos:", error);
      throw error;
    }
  }
  async getOne(key: string): Promise<InstanceType<T> | undefined> {
    try {
      const db = await DB.openDB(this.STORE_NAME);
      const store = db
        .transaction([this.STORE_NAME], "readonly")
        .objectStore(this.STORE_NAME);
      return store.get(key);
    } catch (error) {
      console.error("Error getting todo:", error);
      throw error;
    }
  }
  async add(model: InstanceType<T>): Promise<InstanceType<T>[]> {
    try {
      const db = await DB.openDB(this.STORE_NAME);
      await db.add(this.STORE_NAME, model);
      const updatedTodos = await db.getAll(this.STORE_NAME);
      return updatedTodos;
    } catch (error) {
      console.error("Error adding todo:", error);
      throw error;
    }
  }
  async update(model: InstanceType<T>): Promise<InstanceType<T> | undefined> {
    const db = await DB.openDB(this.STORE_NAME);
    const store = db
      .transaction([this.STORE_NAME], "readwrite")
      .objectStore(this.STORE_NAME);
    const modelData = { ...model };
    await store.put(modelData);
    //return this.get(modelData.id); // Return the updated todo
    return;
  }

  async delete(id: string): Promise<void> {
    try {
      const db = await DB.openDB(this.STORE_NAME);
      await db.delete(this.STORE_NAME, id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  }

  async getIndexValues(indexKey: string): Promise<string[]> {
    const db = await DB.openDB(this.STORE_NAME);
    let cursor = await db
      .transaction(this.STORE_NAME)
      .objectStore(this.STORE_NAME)
      .index(indexKey)
      .openKeyCursor(null, "nextunique");

    const values: string[] = [];
    while (cursor) {
      values.push(cursor.key as string);
      cursor = await cursor.continue();
    }

    return values;
  }
}

// Export a factory function instead of a single instance
export default function createModelDao<T extends typeof Model>(ModelClass: T): ModelDao<T> {
    return new ModelDao(ModelClass);
  }

// const modelDao = new ModelDao(Model);

// export default modelDao;
