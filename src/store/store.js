import {createStore} from 'redux';
import rootReducer from "../reducers/reducers";

const date = new Date();
const startDate = new Date(date.setDate(date.getDate() - 10));

const initialState = {
  name: "Captain Jack Sparrow",
  email: "pirates@caribbean.com",

  transactions: {
    filter: {
          startDate: startDate,
          endDate: new Date()
      },
    transactions: [
      {
        id: 24324,
        amount: "200Rs",
        date: "20/3/2020",
        category: "TV Recharge",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2345,
        amount: "200Rs",
        date: "20/3/2020",
        category: "TV Recharge",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      }
    ]
  },
  categories: [
    {
      name: "TV recharge",
      type: "expense",
      emoji: "#&23667;"
    },
    {
      name: "Salary",
      type: "Income",
      emoji: "#&23667;"
    }
  ]
};

export default createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);