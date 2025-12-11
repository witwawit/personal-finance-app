<template>
  <h1 class="text-3xl font-bold">Recurring Bill</h1>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 py-8">
    <!-- sum box -->
    <div class="col-span-1 flex flex-col gap-5">
      <Card
        class="flex-1 xl:flex-0 bg-sidebar-primary rounded-[12px] text-white shadow-[0_8px_24px_0_rgba(0,0,0,0.05)]"
      >
        <CardContent class="flex flex-col justify-center gap-2">
          <img src="/images/icon-recurring-bills.svg" class="w-10 h-10" />
          <h2>Total Bills</h2>
          <h2 class="text-3xl font-bold">{{ formatCurrency(totalBills) }}</h2>
        </CardContent>
      </Card>

      <Card
        class="flex-1 xl:flex-0 bg-background rounded-[12px] shadow-[0_8px_24px_0_rgba(0,0,0,0.05)]"
      >
        <CardContent>
          <h2 class="text-md font-semibold">Summary</h2>
          <div class="flex justify-between border-b py-4 text-md">
            <h3 class="font-normal">Paid Bills</h3>
            <h3 class="font-semibold">
              {{ filteredPaidBillsCount }} ({{ formatCurrency(paidBills) }})
            </h3>
          </div>

          <div class="flex justify-between border-b py-4 text-md text-upcoming">
            <h3 class="font-normal">Total Upcoming</h3>
            <h3 class="font-semibold">
              {{ filteredUpcomingCount }} ({{ formatCurrency(totalUpcoming) }})
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
      class="colspan-1 xl:col-span-2 rounded-[12px] shadow-[0_8px_24px_0_rgba(0,0,0,0.05)] p-6 bg-background"
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

      <Table v-if="!isMobile">
        <TableHeader>
          <TableRow>
            <TableHead>Bill Title</TableHead>
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
              :class="{
                'text-chart-2': isPaid(transaction),
                '': isDueSoon(transaction),
                '': !isPaid(transaction) && !isDueSoon(transaction),
              }"
            >
              <div class="flex items-center gap-2">
                {{ formatDate(transaction.date) }}
                <img
                  v-if="isPaid(transaction)"
                  src="/images/icon-bill-paid.svg"
                  alt=""
                />
                <img
                  v-else-if="isDueSoon(transaction)"
                  src="/images/icon-bill-due.svg"
                  alt=""
                />
              </div>
            </TableCell>
            <TableCell class="text-right font-bold">
              {{ formatCurrency(transaction.amount) }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div v-else class="space-y-4">
        <div
          v-for="transaction in filteredTransactions"
          :key="transaction.name + transaction.date"
          class="p-4 bg-background rounded-lg shadow"
        >
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <Avatar>
                <AvatarImage :src="transaction.avatar" />
                <AvatarFallback>{{ transaction.name[0] }}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <span class="font-semibold text-sm">{{
                  transaction.name
                }}</span>
                <div
                  :class="{
                    'text-chart-2': isPaid(transaction),
                    '': isDueSoon(transaction),
                    '': !isPaid(transaction) && !isDueSoon(transaction),
                  }"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-xs">{{
                      formatDate(transaction.date)
                    }}</span>
                    <img
                      v-if="isPaid(transaction)"
                      src="/images/icon-bill-paid.svg"
                      alt=""
                    />
                    <img
                      v-else-if="isDueSoon(transaction)"
                      src="/images/icon-bill-due.svg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>

            <span class="text-sm font-bold">
              {{ formatCurrency(transaction.amount) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Transaction {
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
  avatar?: string;
}

import { ref, computed, onMounted } from "vue";
import data from "@/data/data.json";
import { formatCurrency } from "../../helper/formatter";

const transactions: Transaction[] = data.transactions;
const isMobile = ref<boolean>(false);
const searchName = ref<string>("");
const sortField = ref<
  "latest" | "oldest" | "aToZ" | "zToA" | "highest" | "lowest"
>("latest");

const billsTransactions = computed<Transaction[]>(() =>
  transactions.filter((t) => t.recurring)
);

const latestRecurringBills = computed<Transaction[]>(() => {
  const map = new Map<string, Transaction>();

  billsTransactions.value.forEach((t) => {
    const existing = map.get(t.name);

    if (!existing) {
      map.set(t.name, t);
    } else {
      if (new Date(t.date).getTime() > new Date(existing.date).getTime()) {
        map.set(t.name, t);
      }
    }
  });

  return Array.from(map.values());
});

const latestTransactionDate = computed<Date>(() => {
  const latest = transactions.reduce((prev, curr) => {
    const prevTime = new Date(prev.date).getTime();
    const currTime = new Date(curr.date).getTime();
    return currTime > prevTime ? curr : prev;
  });
  return new Date(latest.date);
});

const filteredTransactions = computed<Transaction[]>(() => {
  let result = latestRecurringBills.value;

  if (searchName.value) {
    result = result.filter((t) =>
      t.name.toLowerCase().includes(searchName.value.toLowerCase())
    );
  }

  return [...result].sort((a, b) => {
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
});

const getDayOfMonth = (date: string) => new Date(date).getUTCDate();

const paidBillsTransactions = computed<Transaction[]>(() =>
  latestRecurringBills.value.filter((t) => {
    const billDay = getDayOfMonth(t.date);
    const latestDay = latestTransactionDate.value.getUTCDate();
    return billDay <= latestDay;
  })
);

const dueSoonTransactions = computed<Transaction[]>(() =>
  latestRecurringBills.value.filter((t) => {
    const billDay = getDayOfMonth(t.date);
    const latestDay = latestTransactionDate.value.getUTCDate();
    return billDay > latestDay && billDay <= latestDay + 5;
  })
);

const upcomingTransactions = computed<Transaction[]>(() =>
  latestRecurringBills.value.filter((t) => {
    const billDay = getDayOfMonth(t.date);
    const latestDay = latestTransactionDate.value.getUTCDate();
    return billDay > latestDay;
  })
);

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

  return `Monthly-${day}${getOrdinal(day)}`;
};

const totalBills = computed<number>(() =>
  latestRecurringBills.value.reduce((sum, t) => sum + t.amount, 0)
);

const paidBills = computed<number>(() =>
  paidBillsTransactions.value.reduce((sum, t) => sum + t.amount, 0)
);

const dueSoon = computed<number>(() =>
  dueSoonTransactions.value.reduce((sum, t) => sum + t.amount, 0)
);

const totalUpcoming = computed<number>(() =>
  upcomingTransactions.value.reduce((sum, t) => sum + t.amount, 0)
);

const filteredPaidBillsCount = computed(
  () => paidBillsTransactions.value.length
);
const filteredDueSoonCount = computed(() => dueSoonTransactions.value.length);
const filteredUpcomingCount = computed(() => upcomingTransactions.value.length);

// add logo date
const isPaid = (transaction: Transaction) => {
  const billDay = getDayOfMonth(transaction.date);
  const latestDay = latestTransactionDate.value.getUTCDate();
  return billDay <= latestDay;
};

const isDueSoon = (transaction: Transaction) => {
  const billDay = getDayOfMonth(transaction.date);
  const latestDay = latestTransactionDate.value.getUTCDate();
  return billDay > latestDay && billDay <= latestDay + 5;
};

onMounted(() => {
  isMobile.value = window.innerWidth < 768;

  window.addEventListener("resize", () => {
    isMobile.value = window.innerWidth < 768;
  });
});
</script>
