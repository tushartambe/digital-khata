import {SET_EMAIL, SET_FILTER, SET_NAME} from "../actions/actions";

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
    default:
      return state;
  }
}

export default rootReducer;