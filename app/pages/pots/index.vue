<template>
  <div>
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold">Pots</h1>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-3 py-8">
      <div v-for="pot in pots" :key="pot.name" class="col-span-1 xl:col-span-2">
        <Card>
          <CardHeader>
            <div class="flex justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-5 h-5 rounded-full"
                  :style="{ backgroundColor: pot.theme }"
                ></div>
                <p class="font-bold text-xl">{{ pot.name }}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button class="p-2 rounded hover:bg-gray-100">...</button>
                </DropdownMenuTrigger>

                <DropdownMenuContent class="w-40" align="end">
                  <DropdownMenuItem @click="openDialog('edit', pot)">
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    @click="openDialog('delete', pot)"
                    class="text-chart-3"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div class="flex justify-between items-center">
              <p class="text-sm font-thin">Total Saved</p>
              <p class="text-3xl font-bold">{{ formatCurrency(pot.total) }}</p>
            </div>
            <div class="py-5">
              <Progress
                :model-value="pot.total"
                :max="pot.target"
                :color="pot.theme"
                class="w-full h-3 rounded"
              />
            </div>
            <div class="flex justify-between items-center">
              <p class="text-md font-bold">
                {{ ((pot.total / pot.target) * 100).toFixed(2) }}%
              </p>
              <p class="text-xs font-thin">
                Target of {{ formatCurrency(pot.target) }}
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <div class="flex w-full gap-3">
              <Button
                class="flex-1 text-sidebar-primary font-semibold hover:cursor-pointer hover:border hover:border-sidebar-primary hover:bg-background"
              >
                + Add Money
              </Button>
              <Button
                class="flex-1 text-sidebar-primary font-semibold hover:cursor-pointer hover:border hover:border-sidebar-primary hover:bg-background"
              >
                Withdraw
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
  <!-- modal -->
  <PotDialog
    :open="dialogOpen"
    :action="dialogAction"
    :pot="selectedPot"
    @close="dialogOpen = false"
    @delete="deletePot"
    @save="savePot"
  />
</template>

<script setup lang="ts">
interface IPot {
  name: string;
  theme: string;
  total: number;
  target: number;
}
import { ref } from "vue";
import data from "@/data/data.json";
import PotDialog from "../../components/pot-dialog/PotDialog.vue";
import { formatCurrency } from "../../helper/formatter";

const pots = ref(data.pots);
const dialogOpen = ref(false);
const dialogAction = ref<"edit" | "delete" | null>(null);
const selectedPot = ref<any>(null);

const openDialog = (action: "edit" | "delete", pot: IPot) => {
  selectedPot.value = { ...pot };
  dialogAction.value = action;
  dialogOpen.value = true;
};

const deletePot = (pot: IPot) => {
  pots.value = pots.value.filter((p) => p.name !== pot.name);
  dialogOpen.value = false;
};

const savePot = (pot: IPot) => {
  pots.value = pots.value.map((p) =>
    p.name === selectedPot.value?.name ? pot : p
  );
  dialogOpen.value = false;
};
</script>
