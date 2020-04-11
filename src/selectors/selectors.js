export const selectName = state => state.name;
export const selectEmail = state => state.email;

export const selectTransactions = state => {
  const transactions = state.transactions.transactions;
  return transactions.sort(function (a, b) {
    return  new Date(b.date) - new Date(a.date);
  });
};

export const selectExpenses = state => {
  const transactions = selectTransactions(state);
  return transactions.filter(e => e.type === "expense");
};

export const selectIncome = state => {
  const transactions = selectTransactions(state);
  return transactions.filter(e => e.type === "income");
};

export const selectCategories = state => state.categories;