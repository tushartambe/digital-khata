import {createStore} from 'redux';
import rootReducer from "../reducers/reducers";

const date = new Date();
const startDate = new Date(date.setDate(date.getDate() - 10));

const initialState = {
  transactions: {
    filter: {
      startDate: startDate,
      endDate: new Date()
    },
    transactions: []
  },
  categories: []
};

export default createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);