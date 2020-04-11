import React, {useState} from "react";
import Select from "react-select";
import {PopupWrapper} from "../PopupWrapper";
import styled from "styled-components";
import "../transaction/TransactionPopup.css"
import Header from "../Header";
import {PopUpInput} from "../Input";
import {setEmail, setName} from "../../actions/actions";
import {useSelector} from "react-redux";
import {selectEmail} from "../../selectors/selectors";

const Alert = styled.div`
    height: 30px;
    width: 100%;
    box-sizing:border-box;
    text-align:center;
`;

const CategoryPopup = ({history}) => {
  const [category, setCategory] = useState("")
  const [type, setType] = useState(null);
  const [isDone, setDone] = useState(false);
  const email = useSelector(selectEmail);
  const types = [
    {value: 'income', label: 'Income'},
    {value: 'expense', label: 'Expense'},
  ];

  const addCategory = (event) => {
    event.preventDefault();
    fetch('/api/add-category', {
      method: 'POST',
      body: JSON.stringify({email: email, type: type.value, name: category, emoji: ""}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log(res);
      if (res.status !== 200) {
        throw new Error(res.error);
      }
    }).catch(err => {
      console.error(err);
      alert('Error adding category again');
    });
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

    <PopUpInput type="submit" value="Add category" onClick={(event) => {
      if (category && type) {
        addCategory(event);
        resetLocalState();
      } else {
        setDone("Something is missing");
      }
    }}/>

  </PopupWrapper>)
};

export default CategoryPopup;