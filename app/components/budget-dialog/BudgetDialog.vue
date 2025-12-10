<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ref, watch, computed } from "vue";

interface Transaction {
  name: string;
  category: string;
  date: string;
  amount: number;
  avatar?: string;
}

interface ISummaryNew {
  category: string;
  maximum: number;
  theme: string;
  spender: Transaction[];
  remain: number;
  spent: number;
}

const props = defineProps<{
  open: boolean;
  action: "edit" | "delete" | null;
  budget: ISummaryNew | null;
  budgets?: ISummaryNew[];
}>();

const emit = defineEmits(["close", "delete", "save"]);

const category = ref<String>("");
const maximum = ref<Number>(0);
const theme = ref<String>("#000000");

watch(
  () => props.open,
  (o) => {
    if (o && props.budget) {
      category.value = props.budget.category;
      maximum.value = props.budget.maximum;
      theme.value = props.budget.theme;
    }
  }
);

const usedCategories = computed(() => props.budgets.map((b) => b.category));
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{
            props.action === "edit"
              ? "Edit Budget"
              : `Delete '${props.budget?.category}'?`
          }}
        </DialogTitle>

        <DialogDescription>
          <template v-if="props.action === 'edit'">
            Edit settings for <b>{{ props.budget?.category }}</b
            >.
          </template>
          <template v-else>
            Are you sure you want to delete <b>{{ props.budget?.category }}</b
            >?
          </template>
        </DialogDescription>
      </DialogHeader>

      <!-- ===== EDIT FORM ===== -->
      <div v-if="props.action === 'edit'" class="flex flex-col gap-4">
        <!-- Category Select -->
        <div>
          <label class="text-sm">Category</label>
          <select v-model="category" class="border rounded px-2 py-1 w-full">
            <option
              v-for="cat in usedCategories"
              :key="cat"
              :value="cat"
              :disabled="cat !== props.budget?.category"
            >
              {{ cat }}
              <span v-if="cat !== props.budget?.category"> (used)</span>
            </option>
          </select>
        </div>

        <!-- Maximum -->
        <div>
          <label class="text-sm">Maximum Spend</label>
          <input
            type="number"
            v-model="maximum"
            min="0"
            class="border rounded px-2 py-1 w-full"
          />
        </div>

        <!-- Theme Color -->
        <div>
          <label class="text-sm">Theme Color</label>
          <input
            type="color"
            v-model="theme"
            class="w-full h-10 rounded cursor-pointer"
          />
        </div>
      </div>

      <DialogFooter>
        <div class="flex flex-col gap-2">
          <Button
            v-if="props.action === 'delete'"
            @click="emit('delete', props.budget)"
            class="w-100 bg-chart-3 hover:bg-chart-3"
          >
            Yes, Confirm Deletions
          </Button>

          <Button
            v-if="props.action === 'edit'"
            @click="
              emit('save', {
                ...props.budget,
                category,
                maximum: Number(maximum),
                theme,
              })
            "
            class="w-100"
          >
            Save
          </Button>

          <Button variant="solid" @click="emit('close')" class="w-100">
            No, Go Back
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
