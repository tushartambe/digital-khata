import React, {useState} from "react";
import styled from "styled-components";
import Input from "./Input";
import Select from 'react-select';
import {useSelector} from "react-redux";
import "./_override-react-date-picker.css"
import "./TransactionPopup.css"
import DatePicker from "react-datepicker/es";
import {selectCategories} from "../selectors/selectors";
import Header from "./Header";

const PopupWrapper = styled.div`
  position: fixed;
  background: aliceblue;
  top: 23%;
  width: 100%; 
  height: fit-content;
  padding: 20px 50px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing:border-box;
  box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    
  @media (min-width: 768px) {
    max-width: 400px;
  }
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

  const types = [
    {value: 'income', label: 'Income'},
    {value: 'expense', label: 'Expense'},
  ];

  const filterCategories = (categories, selectedType) => {
    const applicableCategories = categories.filter(category => category.type == selectedType.value);
    let categoriesToShow = [];
    applicableCategories.forEach(category => categoriesToShow.push({value: category.name, label: category.name}));
    return categoriesToShow;
  };

  const addTransaction = () => {

  };

  const resetLocalState = () => {
    setDate(new Date);
    setType(null);
    setCategory(null);
    setAmount(0);
    setDone(true);
    setDescription("");
  };

  return <PopupWrapper onFocus={() => setDone(false)}>

    <Header>Transaction Details</Header>
    {isDone ? <div className="form-date">Your transaction is saved successfully </div> : ""}
    <Input type="text"
           placeholder="description"
           value={description}
           onChange={e => setDescription(e.target.value)}/>
    <Input type="number"
           placeholder="amount"
           value={amount}
           onChange={e => setAmount(e.target.value)}/>
    <DatePicker
      className="form-date"
      selected={date}
      onChange={(selectedDate) => setDate(selectedDate)}/>
    <Select
      className="selector"
      value={type}
      placeholder="select type"
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
      onChange={(selectedCategory) => setCategory(selectedCategory)}
      options={categoriesToShow}/> : ""}
    <Input type="submit" value="Add transaction" onClick={() => {
      addTransaction();
      resetLocalState();
    }}/>

  </PopupWrapper>
};

export default TransactionPopup;