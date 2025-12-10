<template>
  <h1 class="text-3xl font-semibold">overview</h1>

  <div class="flex flex-col xl:flex-row justify-between gap-6 py-8">
    <Card
      v-for="(value, key, index) in balanceCards"
      :key="key"
      class="flex-1 p-6 shadow-[0_8px_24px_0_rgba(0,0,0,0.05) rounded-[12px]"
      :class="index === 0 ? 'bg-sidebar-primary text-white' : ''"
    >
      <CardHeader>
        <h3 class="text-md">{{ key }}</h3>
      </CardHeader>
      <CardContent>
        <h1 class="text-4xl font-bold">{{ value }}</h1>
      </CardContent>
    </Card>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-5 gap-6">
    <div class="col-span-1 xl:col-span-3 flex flex-col gap-5">
      <!-- pots -->
      <Card class="flex-1 shadow-[0_8px_24px_0_rgba(0,0,0,0.05) rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Pots</h2>
            <NuxtLink to="/pots" class="hover:underline text-sm font-normal"
              >See Detail</NuxtLink
            >
          </div>
        </CardHeader>
        <CardContent class="flex flex-col md:flex-row justify-between gap-5">
          <div
            class="flex-1 border p-5 flex items-center gap-5 rounded-[12px] bg-primary"
          >
            <img src="/images/icon-pot.svg" />
            <div>
              <h4 class="text-md font-normal">Total Saved</h4>
              <h2 class="text-2xl font-semibold">
                {{ formatCurrency(totalPots) }}
              </h2>
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
                  <p class="text-xs font-normal">{{ pot.name }}</p>
                  <h2 class="font-semibold">{{ formatCurrency(pot.total) }}</h2>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- transaction -->
      <Card class="flex-1 shadow-[0_8px_24px_0_rgba(0,0,0,0.05) rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Transaction</h2>
            <NuxtLink
              to="/transaction"
              class="hover:underline text-sm font-normal"
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
                <AvatarImage :src="tx.avatar" />
                <AvatarFallback>{{ tx.name[0] }}</AvatarFallback>
              </Avatar>
              <span>{{ tx.name }}</span>
            </div>
            <div class="text-right">
              <p class="text-md font-semibold">
                {{ formatCurrency(tx.amount) }}
              </p>
              <p class="text-xs font-thin">{{ formatDate(tx.date) }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="col-span-1 xl:col-span-2 flex flex-col gap-5 xl:gap-10">
      <!-- budgets -->
      <Card class="flex-1 shadow-[0_8px_24px_0_rgba(0,0,0,0.05) rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Budgets</h2>
            <NuxtLink to="/budgets" class="hover:underline text-sm font-normal">
              See Detail
            </NuxtLink>
          </div>
        </CardHeader>

        <CardContent class="grid grid-cols-2 md:grid-cols-5 gap-2 pt-5">
          <div class="md:col-span-3 col-span-2 border"></div>

          <div class="md:col-span-2 col-span-2 border flex flex-col gap-2">
            <div v-for="budget in budgets" :key="budget.category">
              <div
                class="flex flex-col pl-2 border-l-5"
                :style="{
                  borderLeftColor: budget.theme,
                  borderLeftStyle: 'solid',
                }"
              >
                <h2>{{ budget.category }}</h2>
                <h2>{{ budget.maximum }}</h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <!-- recurring -->
      <Card class="flex-1 shadow-[0_8px_24px_0_rgba(0,0,0,0.05) rounded-[12px]">
        <CardHeader>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Recurring Bills</h2>
            <NuxtLink
              to="/recurring-bills"
              class="hover:underline text-sm font-normal"
            >
              See Detail
            </NuxtLink>
          </div>
        </CardHeader>
        <CardContent>
          <div
            class="p-5 mt-3 border-l-5 border-[#277C78] rounded-[12px] flex justify-between bg-primary"
          >
            <p>Paid Bills</p>
            <p class="font-semibold">{{ formatCurrency(paidBills) }}</p>
          </div>
          <div
            class="p-5 mt-3 border-l-5 border-[#82C9D7] rounded-[12px] flex justify-between bg-primary"
          >
            <p>Due Soon</p>
            <p class="font-semibold">{{ formatCurrency(dueSoon) }}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import data from "@/data/data.json";
import { ref } from "vue";

const budgets = data.budgets;

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
