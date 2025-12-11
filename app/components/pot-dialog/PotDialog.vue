<template>
  <Dialog :open="open" @update:open="$emit('close')">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <DialogTitle class="text-3xl">Delete '{{ pot?.name }}'?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <b>{{ pot?.name }}</b
          >? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div class="flex flex-col gap-2">
          <Button
            @click="emit('delete', pot)"
            class="w-100 bg-chart-3 hover:bg-chart-3 hover:cursor-pointer"
          >
            Yes, Confirm Deletions
          </Button>

          <Button
            variant="solid"
            @click="emit('close')"
            class="w-100 hover:cursor-pointer"
          >
            No, Go Back
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
interface IPot {
  name: string;
  theme: string;
  total: number;
  target: number;
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  open: boolean;
  pot: IPot;
}>();

const emit = defineEmits(["close", "delete"]);
</script>
