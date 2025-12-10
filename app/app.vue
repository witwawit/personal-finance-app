<template>
  <NuxtLayout />
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

if (route.path === "/") {
  router.push("/transaction");
}
</script>
