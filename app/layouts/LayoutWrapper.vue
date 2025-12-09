<template>
  <div class="flex h-screen">
    <aside
      v-if="menuOpen"
      :class="[
        'bg-primary text-white w-64 p-4 flex flex-col',
        'hidden xl:flex',
      ]"
    >
      <div class="mb-8 text-2xl font-bold">Finance</div>
      <nav class="flex flex-col space-y-2">
        <NuxtLink
          v-for="item in navigations"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded"
        >
          <img v-if="item.logo" :src="item.logo" alt="logo" class="w-5 h-5" />
          {{ item.name }}
        </NuxtLink>
      </nav>
    </aside>
    <div class="flex-1 flex flex-col">
      <header
        class="bg-gray-100 p-4 shadow-md flex items-center justify-between"
      >
        <Button size="sm" variant="outline" @click="menuOpen = !menuOpen">
          {{ menuOpen ? "Close Menu" : "Open Menu" }}
        </Button>
        <h1 class="text-xl font-semibold">Dashboard</h1>
      </header>
      <main class="flex-1 p-6 bg-gray-50 overflow-auto"><slot /></main>
    </div>

    <nav
      class="fixed bottom-0 left-0 right-0 bg-primary text-white flex justify-around p-3 md:flex md:justify-around md:p-3 xl:hidden shadow-inner"
    >
      <NuxtLink
        v-for="item in navigations"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center text-sm"
      >
        <img
          v-if="item.logo"
          :src="item.logo"
          alt="logo"
          class="w-6 h-6 mb-1"
        />

        <span class="hidden md:block">{{ item.name }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
<script setup lang="ts">
import { navigations } from "../data/menu";
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const menuOpen = ref(true);
const navigate = (path: string) => {
  router.push(path);
};
</script>
<style scoped>
aside {
  transition: transform 0.3s ease-in-out;
}
</style>
