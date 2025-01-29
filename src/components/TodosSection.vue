    <script setup lang="ts">
      import Todo from "@/models/Todo";
      import TodoList from "./TodoList.vue";
      import { useModelStore } from "@/db/dao/useModelStore";
      const { items, createItem, updateItem, deleteItem } = useModelStore(Todo);
      const create = async () => {
        const todo = new Todo();
        todo.title = '';
        await createItem(todo);
      };
      const remove = async (todo: Todo) => {
        await deleteItem(todo.id);
      };
      const update = async (todo: Todo) => {
        await updateItem(todo);
      };
      
    </script>
<template>
  <section class="Todos">
    <div class="container">
      <div class="header">
        <h2 class="title">TODOS</h2>
        <v-btn variant="outlined" @click="create">ADD TODO</v-btn>
      </div>
      <TodoList :todos="items" @update="update" @delete="remove" />
    </div>
  </section>
</template>


<style scoped>
  .container {
    border-radius: 4px;
    background-color: #fff;
    overflow: hidden;
    box-shadow: var(--shadow-depth-3);
  }

  .header {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
  }

  .title {
    line-height: 32px;
    font-size: 16px;
    color: var(--c-gray);
  }

  .button {
    border: 1px solid var(--c-gray-light);
    border-radius: 2px;
    padding: 0 16px;
    line-height: 30px;
    font-size: 12px;
    color: var(--c-gray);
    transition: all 0.3s;

    &:hover {
      border-color: var(--c-gray);
      color: var(--c-black);
    }
  }
</style>
