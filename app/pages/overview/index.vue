<template>
  <h1>overview</h1>

  <div class="flex flex-col xl:flex-row justify-between gap-6 py-8">
    <Card
      v-for="(value, key, index) in balanceCards"
      :key="key"
      class="flex-1 p-6 shadow rounded-[12px]"
      :class="index === 0 ? 'bg-black text-white' : ''"
    >
      <CardHeader>
        <h3 class="text-sm text-gray-500">{{ key }}</h3>
      </CardHeader>
      <CardContent>
        <h1 class="text-3xl font-bold">{{ value }}</h1>
      </CardContent>
    </Card>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">
    <div class="col-span-3 flex flex-col gap-5">
      <!-- pots -->
      <Card class="flex-1 shadow rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between">
            <p>Pots</p>
            <NuxtLink to="/pots" class="hover:underline"> See Detail</NuxtLink>
          </div>
        </CardHeader>
        <CardContent class="flex sm:flex-col md:flex-row justify-between gap-5">
          <div
            class="flex-1 border p-5 flex items-center gap-5 rounded-[12px] bg-primary"
          >
            Icon
            <div>
              <h3>Total</h3>
              <h1>{{ formatCurrency(totalPots) }}</h1>
            </div>
          </div>
          <div class="flex-1">
            <div class="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
              <div
                v-for="pot in showPots.slice(0, 4)"
                :key="pot.name"
                class="flex-1 flex items-center gap-5 rounded-[12px]"
              >
                <div
                  class="pl-2 border-l-5"
                  :style="{
                    borderLeftColor: pot.theme,
                    borderLeftStyle: 'solid',
                  }"
                >
                  <h2>{{ pot.name }}</h2>
                  <h2 class="font-bold">{{ formatCurrency(pot.total) }}</h2>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- transaction -->
      <Card class="flex-1 shadow rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between">
            <p>Transaction</p>
            <NuxtLink to="/transaction" class="hover:underline"
              >View All</NuxtLink
            >
          </div>
        </CardHeader>
        <CardContent>
          <div
            v-for="tx in transactions.slice(0, 4)"
            :key="tx.name + tx.date"
            class="flex justify-between items-center py-4 border-b-1"
          >
            <div class="flex gap-3 items-center">
              <Avatar>
                <!-- <img :src="tx.avatar" alt="avatar" /> -->
                <AvatarFallback>👤</AvatarFallback>
              </Avatar>
              <span>{{ tx.name }}</span>
            </div>
            <div class="text-right">
              <p>{{ formatCurrency(tx.amount) }}</p>
              <p>{{ formatDate(tx.date) }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="col-span-2 flex flex-col gap-5 xl:gap-10">
      <!-- budgets -->
      <Card class="flex-1 shadow rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between">
            <p>Budgets</p>
            <NuxtLink to="/budgets" class="hover:underline"> See Detail</NuxtLink>
          </div>
        </CardHeader>
        <CardContent class="flex justify-between gap-2 pt-5">
          <div class="flex-1 border"></div>
          <div class="flex-1 border"></div>
        </CardContent>
      </Card>
      <!-- recurring -->
      <Card class="flex-1 shadow rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between">
            <p>Recurring Bills</p>
            <NuxtLink to="/recurring-bills" class="hover:underline">
              See Detail</NuxtLink
            >
          </div>
        </CardHeader>
        <CardContent>
          <div
            class="p-5 mt-3 border-l-5 border-[#277C78] rounded-[12px] flex justify-between bg-primary"
          >
            <p>Paid Bills</p>
            <p>{{ formatCurrency(paidBills) }}</p>
          </div>
          <div
            class="p-5 mt-3 border-l-5 border-[#82C9D7] rounded-[12px] flex justify-between bg-primary"
          >
            <p>Due Soon</p>
            <p>{{ formatCurrency(dueSoon) }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import data from "@/data/data.json";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const balanceCards = {
  Current: formatCurrency(data.balance.current),
  Income: formatCurrency(data.balance.income),
  Expenses: formatCurrency(data.balance.expenses),
};

const totalPots = data.pots.reduce((sum, pot) => sum + pot.total, 0);
const showPots = data.pots.slice(0, 4);
const transactions = data.transactions.slice(0, 4);

const billsTransactions = data.transactions.filter(
  (tx) => tx.category === "Bills"
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const paidBills: number = billsTransactions
  .filter((tx) => tx.recurring === true)
  .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

const dueSoon: number = billsTransactions
  .filter((tx) => tx.recurring === false)
  .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
</script>
