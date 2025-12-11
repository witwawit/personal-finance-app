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

<style>
@import url("https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;600;700&display=swap");

html, body {
  font-family: "Public Sans", sans-serif;
}
</style>