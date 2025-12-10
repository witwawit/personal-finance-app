<template>
  <div class="flex justify-between">
    <h1 class="text-3xl font-semibold">Budgets</h1>
    <Button>+ Add New Budgets</Button>
  </div>

  <div class="py-8">
    <div class="grid grid-cols-1 xl:grid-cols-5 gap-5">
      <div class="col-span-1 xl:col-span-2">
        <Card class="flex-1 shadow rounded-[12px] p-6">
          <CardContent>
            <!-- chart -->

            <!-- summary -->
            <div class="flex flex-col">
              <p>Spending Summary</p>
              <div
                v-for="budget in budgets"
                :key="budget.category"
              >
                <div
                  class="flex justify-between pl-2 border-l-5 my-4"
                  :style="{
                    borderLeftColor: budget.theme,
                    borderLeftStyle: 'solid',
                  }"
                >
                  <h2>{{ budget.category }}</h2>
                  <h2>{{ budget.spent }} of {{ budget.maximum }}</h2>
                </div>
                <Separator />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="col-span-1 xl:col-span-3 flex flex-col gap-5">
        <Card v-for="budget in budgets" :key="budget.category">
          <CardHeader>
            <div class="flex justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-5 h-5 rounded-full"
                  :style="{ backgroundColor: budget.theme }"
                ></div>
                <div>{{ budget.category }}</div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger as-child>
                  <button class="p-2 rounded hover:bg-gray-100">...</button>
                </DropdownMenuTrigger>

                <DropdownMenuContent class="w-40" align="end">
                  <DropdownMenuItem @click="openDialog('edit')">
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem @click="openDialog('delete', budget)">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <p>Maximum: {{ budget.maximum }}</p>
            <div class="py-5">
              <Progress
                :model-value="budget.spent"
                :color="budget.theme"
                :max="budget.remain"
                class="w-full h-3 rounded"
                :class="`bg-[${budget.theme}]`"
              />
            </div>
            <div class="grid grid-cols-2 gap-2 py-3">
              <div
                class="col-span-1 border-l-5 px-3"
                :style="{ borderLeftColor: budget.theme }"
              >
                <p>Spent</p>
                <p>{{ budget.spent }}</p>
              </div>
              <div class="col-span-1 border-l-5 px-3">
                <p>Remaining</p>
                <p>{{ budget.remain }}</p>
              </div>
            </div>
            <Card>
              <CardHeader
                ><div class="flex justify-between">
                  <p>Lastest Spending</p>
                  <NuxtLink
                    :to="{
                      path: '/transaction',
                      query: { category: budget.category },
                    }"
                    class="hover:underline"
                  >
                    See All
                  </NuxtLink>
                </div></CardHeader
              >
              <CardContent>
                <div
                  v-for="tx in budget.spender"
                  :key="tx.name + tx.date"
                  class="flex justify-between border-b-1 py-3"
                >
                  <div class="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage :src="tx.avatar" />
                      <AvatarFallback>{{ tx.name[0] }}</AvatarFallback>
                    </Avatar>
                    <span>{{ tx.name }}</span>
                  </div>
                  <div class="text-right">
                    <p>{{ tx.amount }}</p>
                    <p>{{ tx.date }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>

  <!-- modal -->
  <BudgetDialog
    :open="dialogOpen"
    :action="dialogAction"
    :budget="selectedBudget"
    :budgets="budgets"
    @close="dialogOpen = false"
    @delete="deleteBudget"
    @save="saveBudget"
  />
</template>

<script setup lang="ts">
import data from "@/data/data.json";
import { ref } from "vue";

// Interfaces
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

const dialogOpen = ref(false);
const dialogAction = ref<"edit" | "delete" | null>(null);
const selectedBudget = ref<ISummaryNew | null>(null);

const budgets = ref<ISummaryNew[]>([]);

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const isAugust2024 = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.getFullYear() === 2024 && date.getMonth() === 7;
};

budgets.value = data.budgets.map((budget) => {
  const augustTransactions = data.transactions.filter(
    (tx) => tx.category === budget.category && isAugust2024(tx.date)
  );

  const spent = augustTransactions.reduce(
    (acc, tx) => acc + Math.abs(tx.amount),
    0
  );

  const remain = Math.max(0, budget.maximum - spent);

  const lastThree: Transaction[] = data.transactions
    .filter((tx) => tx.category === budget.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((tx) => ({ ...tx, date: formatDate(tx.date) }));

  return {
    ...budget,
    spender: lastThree,
    spent,
    remain,
  };
});

const openDialog = (action: "edit" | "delete", budget: ISummaryNew) => {
  dialogAction.value = action;
  selectedBudget.value = budget;
  dialogOpen.value = true;
};

const deleteBudget = (budget: ISummaryNew) => {
  budgets.value = budgets.value.filter((b) => b.category !== budget.category);
  dialogOpen.value = false;
};

const saveBudget = (budget: ISummaryNew) => {
  console.log("Save:", budget.category);
  dialogOpen.value = false;
};
</script>
