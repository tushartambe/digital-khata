export const SET_NAME = 'SET_NAME';
export const SET_EMAIL = 'SET_EMAIL';
export const SET_FILTER = "SET_FILTER";

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
