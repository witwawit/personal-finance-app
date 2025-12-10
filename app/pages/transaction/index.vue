<template>
  <h1>Transaction</h1>

  <!-- table -->
  <div class="p-8 rounded-[12px] shadow-[0_8px_24px_0_rgba(0,0,0,0.05)]">
    <!-- filter -->
    <div class="flex flex-wrap items-center justify-between gap-5 mb-4">
      <!-- search -->
      <div class="min-w-[400px]">
        <Input placeholder="Search transaction" v-model="searchName" />
      </div>

      <div class="flex gap-5">
        <!-- sort by -->
        <div class="flex gap-2 items-center">
          <p>Sort by</p>
          <Select v-model="sortField">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="aToZ">A to Z</SelectItem>
              <SelectItem value="zToA">Z to A</SelectItem>
              <SelectItem value="highest">Highest</SelectItem>
              <SelectItem value="lowest">Lowest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- category -->
        <div class="flex gap-2 items-center">
          <p>Category</p>
          <Select v-model="selectedCategory">
            <SelectTrigger class="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transaction</SelectItem>
              <SelectItem
                v-for="category in uniqueCategories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- table -->
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recipient / Sender</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Transaction Date</TableHead>
          <TableHead class="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="transaction in filteredAndPaginatedTransactions"
          :key="transaction.name + transaction.date"
        >
          <TableCell class="flex items-center space-x-2">
            <Avatar>
              <AvatarImage :src="transaction.avatar"  />
              <AvatarFallback>{{ transaction.name[0] }}</AvatarFallback>
            </Avatar>
            <span>{{ transaction.name }}</span>
          </TableCell>
          <TableCell>{{ transaction.category }}</TableCell>
          <TableCell>{{ formatDate(transaction.date) }}</TableCell>
          <TableCell class="text-right font-medium">
            {{ formatCurrency(transaction.amount) }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- pagination -->
    <div class="flex justify-between items-center mt-4">
      <button
        class="px-3 py-1 rounded border"
        :disabled="currentPage === 1"
        @click="prevPage"
      >
        Prev
      </button>

      <div class="flex space-x-2">
        <button
          v-for="page in totalPagesFiltered"
          :key="page"
          @click="goToPage(page)"
          :class="[
            'px-3 py-1 rounded border',
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-black',
          ]"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="px-3 py-1 rounded border"
        :disabled="currentPage === totalPagesFiltered"
        @click="nextPage"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import data from "@/data/data.json";
import { useRoute } from "vue-router";

interface Transaction {
  name: string;
  category: string;
  date: string;
  amount: number;
  avatar?: string;
}

const transactions: Transaction[] = data.transactions;

const searchName = ref<string>("");

const itemsPerPage = 10;
const currentPage = ref<number>(1);

const route = useRoute();
const selectedCategory = ref<string>((route.query.category as string) || "all");

const uniqueCategories = computed<string[]>(() => {
  const categories = transactions.map((t) => t.category);
  return Array.from(new Set(categories));
});

const sortField = ref<
  "latest" | "oldest" | "aToZ" | "zToA" | "highest" | "lowest"
>("latest");

const filteredTransactions = computed<Transaction[]>(() => {
  let result = transactions;

  if (searchName.value) {
    result = result.filter((t) =>
      t.name.toLowerCase().includes(searchName.value.toLowerCase())
    );
  }

  if (selectedCategory.value && selectedCategory.value !== "all") {
    result = result.filter((t) => t.category === selectedCategory.value);
  }

  result = [...result].sort((a, b) => {
    switch (sortField.value) {
      case "latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "aToZ":
        return a.name.localeCompare(b.name);
      case "zToA":
        return b.name.localeCompare(a.name);
      case "highest":
        return b.amount - a.amount;
      case "lowest":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  return result;
});
const totalPagesFiltered = computed<number>(() =>
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
);

const filteredAndPaginatedTransactions = computed<Transaction[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPagesFiltered.value) currentPage.value = page;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
const nextPage = () => {
  if (currentPage.value < totalPagesFiltered.value) currentPage.value++;
};

const formatCurrency = (amount: number): string =>
  amount.toLocaleString("en-US", { style: "currency", currency: "USD" });

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

watch([searchName, selectedCategory, sortField], () => {
  currentPage.value = 1;
});
</script>
