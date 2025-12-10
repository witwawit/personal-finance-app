<template>
  <div class="flex h-screen">
    <aside
      :class="[
        'bg-primary text-white p-4 flex flex-col justify-between rounded-r-xl',
        isCollapsed ? 'w-20' : 'w-64',
        'hidden xl:flex',
      ]"
    >
      <div>
        <div class="mb-8 text-2xl font-bold">Finance</div>
        <nav class="flex flex-col space-y-2">
          <NuxtLink
            v-for="item in navigations"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded"
          >
            <img v-if="item.logo" :src="item.logo" alt="logo" class="w-5 h-5" />
            <span v-if="!isCollapsed">{{ item.name }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- minimized -->
      <NuxtLink
        @click="isCollapsed = !isCollapsed"
        class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded"
      >
        <!-- <img v-if="item.logo" src="../../assets/images/icon-hide-password.svg" alt="logo" class="w-5 h-5" /> -->
        <span class="material-icons">{{ isCollapsed ? ">" : "<" }}</span>
        <span v-if="!isCollapsed">Minimized</span>
      </NuxtLink>
    </aside>
    <div class="flex-1 flex flex-col">
      <main class="flex-1 p-6 bg-white overflow-auto"><slot /></main>
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
import { Button } from "../components/ui/button";
import { navigations } from "../data/menu";
import { useRouter } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const isCollapsed = ref<Boolean>(false);
const navigate = (path: string) => {
  router.push(path);
};
</script>
