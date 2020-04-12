import React, {useState} from "react";
import {PopUpInput} from "../Input";
import Select from 'react-select';
import {useDispatch, useSelector} from "react-redux";
import "../_override-react-date-picker.css"
import "../transaction/TransactionPopup.css"
import DatePicker from "react-datepicker/es";
import {selectCategories, selectEmail, selectFilterDates} from "../../selectors/selectors";
import {PopupWrapper} from "../PopupWrapper";
import styled from "styled-components";
import Header from "../Header";
import {setEmail, setName, setTransactions} from "../../actions/actions";

const Alert = styled.div`
    height: 30px;
    width: 100%;
    box-sizing:border-box;
    text-align:center;
`;

const TransactionPopup = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const categories = useSelector(selectCategories);
  const [type, setType] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoriesToShow, setShowableCategories] = useState(null);
  const [isDone, setDone] = useState(false);
  const email = useSelector(selectEmail);
  const filterDates = useSelector(selectFilterDates);
  const dispatch = useDispatch();
  const types = [
    {value: 'income', label: 'Income'},
    {value: 'expense', label: 'Expense'},
  ];

  const filterCategories = (categories, selectedType) => {
    const applicableCategories = categories.filter(category => category.type === selectedType.value);
    let categoriesToShow = [];
    applicableCategories.forEach(category => categoriesToShow.push({value: category.name, label: category.name}));
    return categoriesToShow;
  };

  const updateTransactions = () => {
    fetch('/api/get-transactions', {
      method: 'POST',
      body: JSON.stringify({email: email, startDate: filterDates.startDate, endDate: filterDates.endDate}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
      } else {
        throw new Error(res.error);
      }
      return res.json();
    }).then(res => {
      dispatch(setName(res.name));
      dispatch(setEmail(res.email));
      dispatch(setTransactions(res.transactions));
      console.log(res.transactions, "THESE ARE COMING");
    }).catch(err => {
      console.error(err);
      alert('Some Error. Refresh the page');
    })
  };

  const addTransaction = (event) => {
    event.preventDefault();
    fetch('/api/add-transaction', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        amount: amount,
        date: date,
        type: type.value,
        category: category.value,
        description: description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.error);
      } else {
        updateTransactions();
      }
    }).catch(err => {
      alert('Error adding Transaction. Please try again.');
    });
  };

  const resetLocalState = () => {
    setDate(new Date);
    setType(types[0]);
    setCategory(categoriesToShow[0]);
    setAmount(0);
    setDone("Your transaction is successful");
    setDescription("");
  };

  return <PopupWrapper onFocus={() => setDone("")}>
    <Header>Transaction Details</Header>

    {isDone ? <Alert>{isDone}</Alert> : ""}
    <PopUpInput
      type="number"
      placeholder="amount"
      value={amount}
      required
      onChange={e => setAmount(e.target.value)}/>

    <DatePicker
      className="form-date"
      selected={date}
      required
      onChange={(selectedDate) => setDate(selectedDate)}/>

    <Select
      className="selector"
      value={type}
      placeholder="select type"
      required
      onChange={(selectedType) => {
        setType(selectedType);
        setCategory(null);
        setShowableCategories(filterCategories(categories, selectedType));
      }}
      options={types}
    />

    {type ? <Select
      className="selector"
      value={category}
      placeholder="select category"
      required
      onChange={(selectedCategory) => setCategory(selectedCategory)}
      options={categoriesToShow}/> : ""}

    <PopUpInput type="text"
                placeholder="note (optional) "
                value={description}
                onChange={e => setDescription(e.target.value)}
    />

    <PopUpInput type="submit" value="Add transaction" onClick={(event) => {
      if (amount && date && type && category) {
        addTransaction(event);
        resetLocalState();
      } else {
        setDone("Something is missing");
      }
    }}/>

  </PopupWrapper>
};

export default TransactionPopup;