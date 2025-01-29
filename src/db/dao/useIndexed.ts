import { reactive } from 'vue';
import { DB } from '../db';
import { Model } from 'pinia-orm';


export function useIndexedDB<T extends typeof Model>(ModelClass: T) {
    const STORE_NAME = ModelClass.entity;

    const getAllIndexed = async (filter?: { indexKey: string; indexValue?: string }): Promise<InstanceType<T>[]> => {
        try {
            const db = await DB.openDB(STORE_NAME);
            const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
            if (filter?.indexValue) {
                return await store.index(filter.indexKey).getAll(filter.indexValue);
            }
            return await store.getAll();
        } catch (error) {
            console.error('Error getting models:', error);
            throw error; // Propagate error
        }
    };

    const getOneIndexed = async (key: string): Promise<InstanceType<T> | undefined> => {
        try {
            const db = await DB.openDB(STORE_NAME);
            const store = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
            return await store.get(key);
        } catch (error) {
            console.error('Error getting model:', error);
            throw error;
        }
    };

    const createIndexed = async (model: InstanceType<T>): Promise<InstanceType<T>[]> => {
        try {
            const db = await DB.openDB(STORE_NAME);
            await db.add(STORE_NAME, model);
            return await getAllIndexed();
        } catch (error) {
            console.error('Error adding model:', error);
            throw error;
        }
    };

    const updateIndexed = async (model: InstanceType<T>): Promise<InstanceType<T> | undefined> => {
        try {
            const db = await DB.openDB(STORE_NAME);
            const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
            // Store the plain object data, not the class instance
            const modelData = { ...model };
            await store.put(modelData);
            // return await getOneIndexed(model.id);
            return
        } catch (error) {
            console.error('Error updating model:', error);
            throw error;
        }
    };

    const deleteIndexed = async (id: string): Promise<void> => {
        try {
            const db = await DB.openDB(STORE_NAME);
            const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME);
            await store.delete(id);
        } catch (error) {
            console.error('Error deleting model:', error);
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