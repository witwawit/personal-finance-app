<template>
  <Dialog :open="props.open" @update:open="emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-sidebar-primary text-3xl">
          {{
            props.action === "edit"
              ? "Edit Budget"
              : `Delete '${props.budget?.category}'?`
          }}
        </DialogTitle>

        <DialogDescription>
          <template v-if="props.action === 'edit'">
            As your budgets change, feel free to update your spending limits.
          </template>
          <template v-else>
            Are you sure you want to delete <b>{{ props.budget?.category }}</b
            >? This action cannot be reversed, and all the data inside it will
            be removed forever.
          </template>
        </DialogDescription>
      </DialogHeader>

      <!-- eidt form -->
      <Form @submit="onSave" class="flex flex-col gap-2">
        <div v-if="props.action === 'edit'" class="flex flex-col gap-2 text-sm">
          <!-- catagory select -->
          <strong>Category:</strong>
          <Select v-model="category" class="w-full">
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Transaction Categories</SelectLabel>
                <SelectItem
                  v-for="cat in transactionCategories"
                  :key="cat"
                  :value="cat"
                  :disabled="
                    usedCategories.includes(cat) &&
                    cat !== props.budget?.category
                  "
                >
                  {{ cat }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <!-- maximum input  -->
          <strong>Maximum Spend:</strong>
          <Field
            name="maximum"
            v-model="maximum"
            as="input"
            type="number"
            min="0"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter maximum budget"
          />
          <span class="text-red-500 text-xs">{{ errors.maximum }}</span>
        </div>

        <DialogFooter>
          <div class="flex flex-col gap-2">
            <Button
              v-if="props.action === 'delete'"
              @click="emit('delete', props.budget)"
              class="w-100 bg-chart-3 hover:bg-chart-3 hover:cursor-pointer"
            >
              Yes, Confirm Deletions
            </Button>

            <Button
              v-if="props.action === 'delete'"
              variant="solid"
              @click="emit('close')"
              class="w-100 hover:cursor-pointer"
            >
              No, Go Back
            </Button>

            <Button
              v-if="props.action === 'edit'"
              type="submit"
              class="w-100 bg-sidebar-primary hover:bg-sidebar-primary hover:cursor-pointer"
              >Save</Button
            >
          </div>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
</template>

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
import { useForm, Field, Form } from "vee-validate";
import * as yup from "yup";

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
  transactions: Transaction[];
}>();

const emit = defineEmits(["close", "delete", "save"]);

const category = ref("");
const maximum = ref(0);
const theme = ref("#000000");

const transactionCategories = computed(() => {
  const categories = props.transactions.map((tx) => tx.category);
  return Array.from(new Set(categories));
});

const usedCategories = computed(
  () => props.budgets?.map((b) => b.category) || []
);

const schema = yup.object({
  maximum: yup
    .number()
    .required("Maximum is required")
    .min(0, "Maximum cannot be less than 0"),
});

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    maximum: maximum.value,
  },
});

const onSave = handleSubmit((values) => {
  if (!props.budget) return;

  const relatedTransactions = props.transactions.filter(
    (tx) => tx.category === category.value
  );

  const spent = relatedTransactions.reduce(
    (acc, tx) => acc + Math.abs(tx.amount),
    0
  );

  const remain = Number(values.maximum) - spent;

  const lastThree: Transaction[] = relatedTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((tx) => ({
      ...tx,
      date: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date(tx.date)),
    }));

  emit("save", {
    ...props.budget,
    category: category.value,
    maximum: Number(values.maximum),
    theme: theme.value,
    spent,
    remain,
    spender: lastThree,
  });
});

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

watch(maximum, (val) => {
  resetForm({ values: { maximum: val } });
});
</script>
