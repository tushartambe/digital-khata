import {SET_CATEGORIES, SET_EMAIL, SET_FILTER, SET_NAME, SET_TRANSACTIONS} from "../actions/actions";

const initialState = {};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NAME:
      return {
        ...state,
        name: action.name
      };

    case SET_EMAIL:
      return {
        ...state,
        email: action.email
      };

    case SET_FILTER :
      return {
        ...state,
        transactions: {
          ...state.transactions,
          filter: action.filter
        }
      };

    case SET_TRANSACTIONS :
      return {
        ...state,
        transactions: {
          ...state.filter,
          transactions: action.transactions
        }
      };

    case SET_CATEGORIES:
      return {
        ...state,
        categories: action.categories
      };

    default:
      return state;
  }
}

export default rootReducer;