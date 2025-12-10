<template>
  <div class="flex h-screen">
    <aside
      :class="[
        'bg-sidebar-primary text-white py-10 px-4 flex flex-col justify-between rounded-r-xl',
        isCollapsed ? 'w-20' : 'w-64',
        'hidden xl:flex',
      ]"
    >
      <div>
        <img
          :src="
            isCollapsed ? `/images/logo-small.svg` : `/images/logo-large.svg`
          "
          :class="`${isCollapsed ? 'm-auto' : ''}`"
        />
        <nav class="flex flex-col space-y-2 py-10">
          <NuxtLink
            v-for="item in navigations"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-2 py-2 rounded text-accent font-semibold',
              route.path === item.path
                ? 'bg-primary border-l-4 border-chart-2 text-sidebar-primary hover:text-sidebar-primary'
                : 'hover:text-white',
              isCollapsed ? 'px-1 justify-center' : 'px-4',
            ]"
          >
            <img v-if="item.logo" :src="item.logo" alt="logo" class="w-5 h-5" />
            <span v-if="!isCollapsed">{{ item.name }}</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- minimized -->
      <NuxtLink
        @click="isCollapsed = !isCollapsed"
        class="flex items-center gap-2 px-4 py-2 text-accent hover:text-white hover:cursor-pointer rounded"
      >
        <img
          :src="
            isCollapsed
              ? '/images/icon-minimize-menu.svg'
              : '/images/icon-minimize-menu.svg'
          "
          alt="logo"
          class="w-4 h-4"
          :class="isCollapsed ? 'rotate-180' : ''"
        />
        <span v-if="!isCollapsed">Minimized</span>
      </NuxtLink>
    </aside>
    <div class="flex-1 flex flex-col">
      <main class="flex-1 p-6 bg-primary overflow-auto">
        <slot />

        <div class="p-10 block xl:hidden"></div>
      </main>
    </div>

    <nav
      class="fixed bottom-0 left-0 right-0 bg-sidebar-primary text-white flex justify-around p-3 md:flex md:justify-around md:p-3 xl:hidden shadow-inner"
    >
      <NuxtLink
        v-for="item in navigations"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex flex-col items-center text-sm p-3 rounded-t-md font-semibold',
          route.path === item.path
            ? 'bg-primary border-b-4 border-chart-2 text-sidebar-primary'
            : 'text-accent',
        ]"
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
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
const router = useRouter();
const route = useRoute();
const isCollapsed = ref<Boolean>(false);
const navigate = (path: string) => {
  router.push(path);
};
</script>
