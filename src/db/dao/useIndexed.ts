import { reactive } from "vue";
import { DB } from "../db";
import { Model } from "pinia-orm";

export function useIndexedDB<T extends typeof Model>(ModelClass: T) {
  const STORE_NAME = ModelClass.entity;

  // Helper function to serialize model data
  const serializeModel = (model: InstanceType<T>): Record<string, any> => {
    const serialized: Record<string, any> = {};

    // Get all own properties of the model instance
    for (const key of Object.keys(model)) {
      const value = (model as any)[key];

      // Skip functions and undefined values
      if (typeof value === "function" || value === undefined) {
        continue;
      }

      // Handle arrays (like todos relationship)
      if (Array.isArray(value)) {
        // Store only IDs for relationships
        serialized[key] = value.map((item) =>
          typeof item === "object" && item.id ? item.id : item
        );
        continue;
      }

      // Handle nested objects
      if (value && typeof value === "object" && "id" in value) {
        serialized[key] = value.id;
        continue;
      }

      // Store primitive values as is
      serialized[key] = value;
    }

    return serialized;
  };

  const getAllIndexed = async (filter?: {
    indexKey: string;
    indexValue?: string;
  }): Promise<InstanceType<T>[]> => {
    try {
      const db = await DB.openDB(STORE_NAME);
      const store = db
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME);
      if (filter?.indexValue) {
        return await store.index(filter.indexKey).getAll(filter.indexValue);
      }
      return await store.getAll();
    } catch (error) {
      console.error("Error getting models:", error);
      throw error;
    }
  };

  const getOneIndexed = async (
    key: string
  ): Promise<InstanceType<T> | undefined> => {
    try {
      const db = await DB.openDB(STORE_NAME);
      const store = db
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME);
      return await store.get(key);
    } catch (error) {
      console.error("Error getting model:", error);
      throw error;
    }
  };

  const createIndexed = async (
    model: InstanceType<T>
  ): Promise<InstanceType<T>[]> => {
    try {
      const db = await DB.openDB(STORE_NAME);
      const serializedModel = serializeModel(model);
      await db.add(STORE_NAME, serializedModel);
      return await getAllIndexed();
    } catch (error) {
      console.error("Error adding model:", error);
      throw error;
    }
  };

  const updateIndexed = async (
    model: InstanceType<T>
  ): Promise<InstanceType<T> | undefined> => {
    try {
      const db = await DB.openDB(STORE_NAME);
      const store = db
        .transaction(STORE_NAME, "readwrite")
        .objectStore(STORE_NAME);
      const serializedModel = serializeModel(model);
      await store.put(serializedModel);
      return
    //   return await getOneIndexed(model.id);
    } catch (error) {
      console.error("Error updating model:", error);
      throw error;
    }
  };

  const deleteIndexed = async (id: string): Promise<void> => {
    try {
      const db = await DB.openDB(STORE_NAME);
      const store = db
        .transaction(STORE_NAME, "readwrite")
        .objectStore(STORE_NAME);
      await store.delete(id);
    } catch (error) {
      console.error("Error deleting model:", error);
      throw error;
    }
  };

  return reactive({
    createIndexed,
    getAllIndexed,
    getOneIndexed,
    updateIndexed,
    deleteIndexed,
  });
}
