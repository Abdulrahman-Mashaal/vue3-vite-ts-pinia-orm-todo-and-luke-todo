<script setup lang="ts">
  import User from "@/models/User";
  import UserList from "./UserList.vue";
  import { useModelStore } from "@/db/dao/useModelStore";
  const { items, createItem, updateItem, deleteItem } = useModelStore(User);

  const create = async () => {
    const user = new User();
    user.name = "";
    await createItem(user);
  };
  const remove = async (user: User) => {
    await deleteItem(user.id);
  };
  const update = async (user: User) => {
    await updateItem(user);
  };
</script>
<template>
  <section class="Users">
    <div class="container">
      <div class="header">
        <h2 class="title">USERS</h2>
        <v-btn variant="outlined" @click="create">ADD USER</v-btn>
      </div>
      <UserList :users="items" @update="update" @delete="remove" />
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
