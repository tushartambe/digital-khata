import React, {useState} from "react";
import Select from "react-select";
import {PopupWrapper} from "../PopupWrapper";
import styled from "styled-components";
import "../transaction/TransactionPopup.css"
import Header from "../Header";
import {PopUpInput} from "../Input";
import {setCategories, setEmail, setName, setTransactions} from "../../actions/actions";
import {useDispatch, useSelector} from "react-redux";
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
  const dispatch = useDispatch();
  const types = [
    {value: 'income', label: 'Income'},
    {value: 'expense', label: 'Expense'},
  ];

  const updateCategories = () => {
    fetch('/api/get-categories', {
      method: 'POST',
      body: JSON.stringify({email}),
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
      dispatch(setCategories(res.categories));
    }).catch(err => {
      console.error(err);
      alert('Some Error. Refresh the page');
    })
  };

  const addCategory = (event) => {
    event.preventDefault();
    fetch('/api/add-category', {
      method: 'POST',
      body: JSON.stringify({email: email, type: type.value, name: category, emoji: ""}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.error);
      } else {
        updateCategories();
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