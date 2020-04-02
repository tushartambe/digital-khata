export const SET_NAME = 'SET_NAME';
export const SET_EMAIL = 'SET_EMAIL';

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