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
        amount: 100,
        date:"2020-03-20",
        category: "TV Recharge",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },{
        id: 24314,
        amount: 50,
        date:"2020-03-21",
        category: "TV Recharge",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },{
        id: 242,
        amount: 560,
        date:"2020-03-22",
        category: "TV Recharge",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 242,
        amount: 830,
        date:"2020-03-20",
        category: "Food",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 242,
        amount: 200,
        date:"2020-03-20",
        category: "Food",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2345,
        amount: 600,
        date:"2020-03-24",
        category: "Salary",
        type:"income",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2346,
        amount: 900,
        date:"2020-02-24",
        category: "Salary",
        type:"income",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2346,
        amount: 900,
        date:"2020-01-30",
        category: "Salary",
        type:"income",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2346,
        amount: 990,
        date:"2020-02-24",
        category: "Travel",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2346,
        amount: 60,
        date:"2020-02-02",
        category: "Travel",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2346,
        amount: 900,
        date:"2020-02-28",
        category: "Gifts",
        type:"expense",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
      {
        id: 2346,
        amount: 900,
        date:"2020-02-24",
        category: "Cachback",
        type:"income",
        description: "recharge for person 1",
        receipt: "https://images/23/jsgf.jpg"
      },
    ]
  },
  categories: [
    {
      name: "TV Recharge",
      type: "expense",
      emoji: "#&23667;"
    },
    {
      name: "Salary",
      type: "income",
      emoji: "#&23667;"
    },
    {
      name: "Food",
      type: "expense",
      emoji: "#&23667;"
    },
    {
      name: "Travel",
      type: "expense",
      emoji: "#&23667;"
    },
    {
      name: "Gifts",
      type: "expense",
      emoji: "#&23667;"
    },
    {
      name: "Cashback",
      type: "income",
      emoji: "#&23667;"
    }
  ]
};

export default createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);