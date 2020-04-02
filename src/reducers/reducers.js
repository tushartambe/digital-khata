import {SET_EMAIL, SET_NAME} from "../actions/actions";

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

    default:
      return state;
  }
}

export default rootReducer;