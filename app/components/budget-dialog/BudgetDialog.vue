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
}>();

const emit = defineEmits(["close", "delete", "save"]);
</script>

<template>
  <Dialog :open="props.open" @update:open="emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle>
          {{ props.action === "edit" ? "Edit Budget" : "Delete Budget" }}
        </DialogTitle>

        <DialogDescription>
          <template v-if="props.action === 'edit'">
            Edit settings for <b>{{ props.budget?.category }}</b
            >.
          </template>

          <template v-else>
            Are you sure you want to delete
            <b>{{ props.budget?.category }}</b
            >? This action cannot be undone.
          </template>
        </DialogDescription>
      </DialogHeader>

      <div v-if="props.action === 'edit'">
        <p class="text-sm">Add your edit form here.</p>
      </div>

      <div v-else class="text-sm">
        This will permanently remove this budget.
      </div>

      <DialogFooter>
        <Button variant="secondary" @click="emit('close')">Cancel</Button>

        <Button
          v-if="props.action === 'delete'"
          variant="destructive"
          @click="emit('delete', props.budget)"
        >
          Delete
        </Button>

        <Button
          v-if="props.action === 'edit'"
          @click="emit('save', props.budget)"
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
