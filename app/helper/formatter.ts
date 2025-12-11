export const formatCurrency = (amount: number): string =>
    Math.abs(amount).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
    });

export const formatCurrencyNegative = (amount: number): string =>
    amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
