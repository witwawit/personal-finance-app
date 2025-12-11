<template>
  <div
    class="xl:h-full h-80 w-full"
    style="max-width: 100%; aspect-ratio: 1 / 1"
  >
    <VisSingleContainer :data="chartData">
      <VisDonut
        :value="(b: Data) => b.spent"
        :color="(b: Data) => b.theme"
        :arc-width="50"
        :central-label="centralLabel"
        :central-sub-label="centralSubLabel"
      />
    </VisSingleContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { VisDonut, VisSingleContainer } from "@unovis/vue";

interface IBudget {
  category: string;
  maximum: number;
  spent?: number;
  theme: string;
}

const props = defineProps<{
  budgets: IBudget[];
  showNumber?: boolean;
}>();

type Data = IBudget;
const chartData = ref<Data[]>([]);
const showNumber = ref<Boolean>(true);

watch(
  () => props.budgets,
  (newVal) => {
    chartData.value = newVal.map((b) => ({
      category: b.category,
      spent: b.spent,
      maximum: b.maximum,
      theme: b.theme,
    }));
  },
  { immediate: true, deep: true }
);

const centralLabel = computed(() => {
  if (props.showNumber === false) return "";
  const totalSpent = chartData.value.reduce(
    (acc, b) => acc + (b.spent || 0),
    0
  );
  return `$${totalSpent}`;
});

const centralSubLabel = computed(() => {
  if (props.showNumber === false) return "";
  const totalMax = chartData.value.reduce(
    (acc, b) => acc + (b.maximum || 0),
    0
  );
  return `of $${totalMax} limit`;
});
</script>
