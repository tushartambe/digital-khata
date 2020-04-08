import React, {useState} from "react";
import Select from "react-select";
import {PopupWrapper} from "../PopupWrapper";
import styled from "styled-components";
import "../transaction/TransactionPopup.css"
import Header from "../Header";
import {PopUpInput} from "../Input";

const Alert = styled.div`
    height: 30px;
    width: 100%;
    box-sizing:border-box;
    text-align:center;
`;

const CategoryPopup = () => {
  const [category, setCategory] = useState("")
  const [type, setType] = useState(null);
  const [isDone, setDone] = useState(false);
  const types = [
    {value: 'income', label: 'Income'},
    {value: 'expense', label: 'Expense'},
  ];

  const addCategory = () => {
    return (category && type);
  };

  const resetLocalState = () => {
  setCategory("");
  setType(null);
  setDone("Your category is saved successfully");
  };

  return (<PopupWrapper onFocus={() => setDone("")}>
    <Header>Category Details</Header>
    {isDone ? <Alert>{isDone}</Alert> : ""}
    <Select
      className="selector"
      value={type}
      placeholder="select type"
      required
      onChange={(selectedType) => {
        setType(selectedType);
      }}
      options={types}
    />

    <PopUpInput
      type="text"
      placeholder="Name"
      value={category}
      required
      onChange={e => setCategory(e.target.value)}/>

    <PopUpInput type="submit" value="Add category" onClick={() => {
      addCategory() ? resetLocalState() : setDone("Something is missing");
    }}/>

  </PopupWrapper>)
};

export default CategoryPopup;