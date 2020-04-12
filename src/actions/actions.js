export const SET_NAME = 'SET_NAME';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_FILTER = "SET_FILTER";
export const SET_CATEGORIES = "SET_CATEGORIES";
export const SET_TRANSACTIONS = "SET_TRANSACTIONS";

export const setName = (name) => {
  return {
    type: SET_NAME,
    name
  }
};

export const setEmail = (email) => {
  return {
    type: SET_EMAIL,
    email
  }
};

export const setFilter = (filter) => {
  return {
    type: SET_FILTER,
    filter
  }
};

export const setCategories = (categories) => {
  console.log("CAT",categories)
  return {
    type: SET_CATEGORIES,
    categories
  }
};

export const setTransactions = (transactions) => {
  console.log("TAN",transactions)
  return {
    type: SET_TRANSACTIONS,
    transactions
  }
};