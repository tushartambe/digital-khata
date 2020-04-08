import React, {useState} from "react";
import {PopUpInput} from "../Input";
import Select from 'react-select';
import {useSelector} from "react-redux";
import "../_override-react-date-picker.css"
import "../transaction/TransactionPopup.css"
import DatePicker from "react-datepicker/es";
import {selectCategories} from "../../selectors/selectors";
import {PopupWrapper} from "../PopupWrapper";
import styled from "styled-components";
import Header from "../Header";

const Alert = styled.div`
    height: 30px;
    width: 100%;
    box-sizing:border-box;
    text-align:center;
`;

const TransactionPopup = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(null);
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
    const applicableCategories = categories.filter(category => category.type === selectedType.value);
    let categoriesToShow = [];
    applicableCategories.forEach(category => categoriesToShow.push({value: category.name, label: category.name}));
    return categoriesToShow;
  };

  const addTransaction = () => {
    return (amount && date && type && category)
  };

  const resetLocalState = () => {
    setDate(new Date);
    setType(type[0]);
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

    <PopUpInput type="submit" value="Add transaction" onClick={() => {
      addTransaction() ? resetLocalState() : setDone("Something is missing");
    }}/>

  </PopupWrapper>
};

export default TransactionPopup;