<template>
  <h1 class="text-3xl font-semibold">Recurring Bill</h1>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 py-8">
    <!-- sum box -->
    <div class="col-span-1 flex xl:flex-col gap-5">
      <Card
        class="bg-sidebar-primary w-full rounded-[12px] p-[24px] text-white shadow-[0_8px_24px_0_rgba(0,0,0,0.05)]"
      >
        <CardContent class="flex flex-col justify-center">
          <img src="/images/icon-recurring-bills.svg" class="w-10 h-10" />
          <h2>Total Bills</h2>
          <h2 class="text-3xl font-bold">{{ formatCurrency(totalBills) }}</h2>
        </CardContent>
      </Card>

      <Card
        class="bg-background w-full rounded-[12px] p-[20px] shadow-[0_8px_24px_0_rgba(0,0,0,0.05)]"
      >
        <CardContent>
          <h2 class="text-md font-semibold">Summary</h2>
          <div class="flex justify-between border-b py-4 text-md">
            <h3 class="font-normal">Paid Bills</h3>
            <h3 class="font-semibold">
              {{ filteredPaidBillsCount }} ({{ formatCurrency(paidBills) }})
            </h3>
          </div>

          <div class="flex justify-between border-b py-4 text-md text-chart-3">
            <h3 class="font-normal">Due Soon</h3>
            <h3 class="font-semibold">
              {{ filteredDueSoonCount }} ({{ formatCurrency(dueSoon) }})
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- table -->
    <div
      class="col-span-2 rounded-[12px] shadow-[0_8px_24px_0_rgba(0,0,0,0.05)] p-6 bg-background"
    >
      <div class="flex flex-wrap items-center justify-between gap-5 mb-4">
        <div class="min-w-[300px]">
          <Input placeholder="Search Bills" v-model="searchName" />
        </div>

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
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recipient / Sender</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead class="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="transaction in filteredTransactions"
            :key="transaction.name + transaction.date"
          >
            <TableCell class="flex items-center space-x-2">
              <Avatar>
                <AvatarImage :src="transaction.avatar" />
                <AvatarFallback>{{ transaction.name[0] }}</AvatarFallback>
              </Avatar>
              <span>{{ transaction.name }}</span>
            </TableCell>
            <TableCell
              :class="transaction.recurring ? 'text-green-600' : 'text-red-600'"
            >
              {{ formatDate(transaction.date) }}
            </TableCell>
            <TableCell class="text-right font-medium">
              {{ formatCurrency(transaction.amount) }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import data from "@/data/data.json";

interface Transaction {
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
  avatar?: string;
}

const transactions: Transaction[] = data.transactions;

const searchName = ref<string>("");

const sortField = ref<
  "latest" | "oldest" | "aToZ" | "zToA" | "highest" | "lowest"
>("latest");

const billsTransactions = computed<Transaction[]>(() =>
  transactions.filter((t) => t.category === "Bills")
);

const filteredTransactions = computed<Transaction[]>(() => {
  let result = transactions.filter((t) => t.category === "Bills");

  if (searchName.value) {
    result = result.filter((t) =>
      t.name.toLowerCase().includes(searchName.value.toLowerCase())
    );
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

const totalBills = computed<number>(() =>
  billsTransactions.value.reduce((sum, t) => sum + t.amount, 0)
);

const filteredPaidBillsCount = computed<number>(
  () => billsTransactions.value.filter((t) => t.recurring).length
);

const filteredDueSoonCount = computed<number>(
  () => billsTransactions.value.filter((t) => !t.recurring).length
);

const paidBills = computed<number>(() =>
  billsTransactions.value
    .filter((t) => t.recurring)
    .reduce((sum, t) => sum + t.amount, 0)
);

const dueSoon = computed<number>(() =>
  billsTransactions.value
    .filter((t) => !t.recurring)
    .reduce((sum, t) => sum + t.amount, 0)
);

const formatCurrency = (amount: number): string =>
  Math.abs(amount).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  const day = date.getUTCDate();
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Get month name
  const month = date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });

  return `${month}-${day}${getOrdinal(day)}`;
};
</script>
