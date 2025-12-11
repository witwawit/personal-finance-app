# Personal finance app solution

### Built with

- [Vuejs](https://vuejs.org/) - JS library
- [Nuxt.js](https://nuxt.com/) - Vue framework
- [Shadcn Vue](https://www.shadcn-vue.com/) - For styles

```bash
# yarn
yarn install

# build
yarn buid

# dev
yarn nuxt dev
```

### Links

_Deploy By Netlify_

- Site URL: [Netlify](https://moonlit-croquembouche-c287a7.netlify.app/)

_Github Repository_

- Site URL: [Github](https://github.com/witwawit/personal-finance-app/tree/master)

_Branch_

- All Work is in master

## My Duration of this work

About 3 days (I started count when my gmail test was send (when 10.00 pm))

## 100% responsive and follow by design theme

## Features Implemented

## Layout

- Responsive Navbar can hide navbar , active , different style in each screen
- if path is / will redirect to /overview

## Overview Page

- Displays all financial data according to the design.
- Clicking "See More" or "View All" links to other detailed pages.

## Transactions Page

- Correct pagination implementation.
- Users can sort and search transactions.

## Budgets Page

- Displays various lists with pie chart graphics.
- Allows deleting entries, which will update the chart.
- Deleting data (Simulated).
- Editing categories (Prevents selecting duplicate categories. If a category is duplicated, it will be disabled).
- Click "See All" at Latest Spending will redirect to transaction by auto sorting

_Missing Features_:

- Users cannot create new entries yet.
- Theme customization (color changes) is not yet possible.

## Pots Page

- Displays a list of pots with progress charts showing calculated percentages.
- Allows deleting entries (Simulated).

_Missing Features_:

- Editing data
- Creating new entries
- Modal functionality for "Withdraw" and "Add Money" is not yet implemented.

## Recurring Bills Page

The logic for recurring bills is based on the most recent transaction date.
The README mentions August 19, 2024, but in the transaction data, the latest transaction is for August 20, 2024, for "Savory Bites Bistro." Therefore, I have used August 20, 2024, as the reference date.

- Displays all recurring transactions (recurring = true).
- If there are duplicate entries, only the most recent vendor is shown.
- Text "Total Bills": Represents the total amount of all transactions displayed in the table.
- Paid: Displays items that have passed their most recent transaction date (e.g., July 20, 2024). All of these items are considered completed.
- Upcoming: Displays transactions after July 20, 2024. Since there are none, nothing is shown.
- Due Soon: Displays transactions that are due within the next 5 days of the most recent date (e.g., before July 20, 2024). No transactions meet this criterion, so nothing is displayed.

_I apologize if some of the features do not fully meet the original specifications or are incomplete._

Thank you for your consideration, and I sincerely hope to have the opportunity to work with your organization.
