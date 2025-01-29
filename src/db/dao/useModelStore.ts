import { onMounted, ref } from 'vue';
import { useIndexedDB } from '@/db/dao/useIndexed';
import { Model } from 'pinia-orm';

export function useModelStore<T extends typeof Model>(ModelClass: T) {
  const indexedDB = useIndexedDB(ModelClass);
  const items = ref([] as InstanceType<T>[]);

  // Initialize data
  onMounted(async () => {
    await fetchAll();
  });

  const fetchAll = async () => {
    items.value = await indexedDB.getAllIndexed();
  };

  const fetchOne = async (id: string) => {
    return await indexedDB.getOneIndexed(id);
  };

  const createItem = async (model: InstanceType<T>) => {
    const updatedData = await indexedDB.createIndexed(model);
    items.value = updatedData;
  };

  const updateItem = async (model: InstanceType<T>) => {
    await indexedDB.updateIndexed(model);
    await fetchAll(); // Refresh data
  };

  const deleteItem = async (id: string) => {
    await indexedDB.deleteIndexed(id);
    await fetchAll(); // Refresh data
  };

  return {
    items,
    createItem,
    updateItem,
    deleteItem,
    fetchAll,
    fetchOne
  };
}