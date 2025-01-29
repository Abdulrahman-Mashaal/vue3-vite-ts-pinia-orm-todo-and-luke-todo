    <script setup lang="ts">
      import User from "@/models/User";
      import { defineEmits } from "vue";


      defineProps<{ users: User[] }>();
         function onInput (user: User, e: Event) {
            update(user, (e.target as HTMLInputElement).value);
          }
          function update (user: User, newName: string){
            if (!user || !user.id) {
        throw new Error('Invalid user data provided for update.');
      }
            user.name = newName;
            $emit('update', user);

          }
          const $emit = defineEmits<{
            (event: 'update', user: User): void
            (event: 'delete', user: User): void
          }>()
      
    </script>
<template>
  <div class="user-list">
    <v-row v-for="user in users" :key="user.id" class="user-row">
      <v-col md="8">
        <input
          class="input"
          :value="user.name"
          placeholder="Type in user's name!"
          @input="onInput(user, $event)"
        />
      </v-col>
      <v-col class="d-flex align-center">
        <p class="tasks">{{ user.todos.length }} Tasks</p>
      </v-col>
      <v-col class="d-flex align-end justify-end">
        <v-btn icon flat @click="$emit('delete', user)">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
  .user-list {
    padding: 12px;
    .user-row {
      margin: 0px 8px 0 8px;
      .v-col {
        padding: 0 12px 0 12px;
      }
      &:hover {
        background-color: #fafafa;
        border-radius: 4px;
      }
      .input {
        flex-grow: 1;
        border: 0;
        padding: 12px 24px 12px 4px;
        width: 100%;
        background-color: transparent;
        transition: all 0.3s;
      }
    }
  }
</style>
