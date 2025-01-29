import { reactive, onMounted } from 'vue';
import { useIndexedDB } from '@/db/dao/useIndexed';
import Todo from '@/models/Todo';

export function useTodoStore() {
  const indexedDB = useIndexedDB(Todo);
  const state = reactive({
    items: [] as InstanceType<typeof Todo>[]
  });

  // Initialize data
  onMounted(async () => {
    await fetchAll();
  });

  const fetchAll = async () => {
    state.items = await indexedDB.getAllIndexed();
  };

  const createItem = async (model: Todo) => {
    const updatedData = await indexedDB.createIndexed(model);
    state.items = updatedData;
  };

  const updateItem = async (model: Todo) => {
    await indexedDB.updateIndexed(model);
    await fetchAll(); // Refresh data
  };

  const deleteItem = async (id: string) => {
    await indexedDB.deleteIndexed(id);
    await fetchAll(); // Refresh data
  };

  return {
    state,
    createItem,
    updateItem,
    deleteItem,
    fetchAll
  };
}