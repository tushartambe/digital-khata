export const selectName = state => state.name;

export const selectTransactions = state => {
  const transactions = state.transactions.transactions;
  return transactions.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
};

export const selectExpenses = state => {
  const expenseCategories = state.categories.filter(e => e.type === "expense").map(e => e.name);
  const transactions = selectTransactions(state);
  return transactions.filter(t => expenseCategories.includes(t.category));
};

export const selectIncome = state => {
  const expenseCategoroes = state.categories.filter(e => e.type === "income").map(e => e.name);
  const transactions = selectTransactions(state);
  return transactions.filter(t => expenseCategoroes.includes(t.category));
};

