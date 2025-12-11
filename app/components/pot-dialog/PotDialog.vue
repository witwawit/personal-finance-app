<template>
  <Dialog :open="props.open" @update:open="emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-sidebar-primary text-3xl">
          {{
            props.action === "edit"
              ? "Edit Pot"
              : `Delete '${props.pot?.name}'?`
          }}
        </DialogTitle>
        <DialogDescription>
          <template v-if="props.action === 'edit'">
            If your saving targets change, feel free to update your pots.
          </template>
          <template v-else>
            Are you sure you want to delete <b>{{ props.pot?.name }}</b
            >? This action cannot be undone.
          </template>
        </DialogDescription>
      </DialogHeader>

      <Form @submit="onSave" class="flex flex-col gap-3">
        <div v-if="props.action === 'edit'" class="flex flex-col gap-2 text-sm">
          <strong>Pot Name:</strong>
          <Field
            name="name"
            v-model="name"
            as="input"
            type="text"
            class="w-full border rounded px-2 py-1"
          />
          <span class="text-red-500 text-xs">{{ errors.name }}</span>

          <strong>Target:</strong>
          <Field
            name="target"
            v-model="target"
            as="input"
            type="number"
            min="0"
            class="w-full border rounded px-2 py-1"
          />
          <span class="text-red-500 text-xs">{{ errors.target }}</span>

          <strong>Theme Color:</strong>
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 rounded-full border"
              :style="{ backgroundColor: theme }"
            ></div>
            <Select v-model="theme" class="w-full">
              <SelectTrigger>
                <SelectValue placeholder="Choose a theme color" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Colors</SelectLabel>
                  <SelectItem
                    v-for="color in themeColors"
                    :key="color.value"
                    :value="color.value"
                    :disabled="usedColors.includes(color.value)"
                  >
                    <div class="flex items-center gap-2">
                      <span
                        class="w-4 h-4 rounded-full border"
                        :style="{ backgroundColor: color.value }"
                      ></span>
                      {{ color.label }}
                      <span
                        v-if="usedColors.includes(color.value)"
                        class="text-xs text-gray-400"
                      >
                        Already used
                      </span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <div class="flex flex-col gap-2">
            <Button
              v-if="props.action === 'delete'"
              @click="emit('delete', props.pot)"
              class="w-100 bg-chart-3 hover:bg-chart-3 hover:cursor-pointer"
            >
              Yes, Confirm Deletion
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
              class="w-100 bg-sidebar-primary hover:bg-sidebar-primary"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </Form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useForm, Field, Form } from "vee-validate";
import * as yup from "yup";
import { themeColors } from "../../data/pallette";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IPot {
  name: string;
  theme: string;
  total: number;
  target: number;
  spent: number;
  remain: number;
  recentContributions: { amount: number; date: string }[];
}

const props = defineProps<{
  open: boolean;
  action: "edit" | "delete" | null;
  pot: IPot | null;
  pots?: IPot[];
}>();

const emit = defineEmits(["close", "delete", "save"]);

const name = ref("");
const target = ref(0);
const theme = ref("#000000");

const schema = yup.object({
  name: yup
    .string()
    .max(16, "Name cannot exceed 16 chars")
    .required("Name is required"),
  target: yup.number().min(0, "Target cannot be negative").required(),
});

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: name.value,
    target: target.value,
  },
});

const usedColors = computed(() => {
  return (
    props.pots?.filter((p) => p.name !== props.pot?.name).map((p) => p.theme) ||
    []
  );
});

const onSave = handleSubmit(() => {
  if (!props.pot) return;

  const spent = props.pot.spent || 0;
  const remain = Number(target.value) - spent;

  emit("save", {
    ...props.pot,
    name: name.value,
    theme: theme.value,
    target: Number(target.value),
    spent,
    remain,
    recentContributions: props.pot.recentContributions || [],
  });
});

watch(
  () => props.open,
  (open) => {
    if (open && props.pot) {
      name.value = props.pot.name;
      target.value = props.pot.target;
      theme.value = props.pot.theme;
      resetForm({
        values: {
          name: props.pot.name,
          target: props.pot.target,
        },
      });
    }
  }
);
</script>
