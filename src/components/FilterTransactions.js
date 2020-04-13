import React, {useState} from "react";
import styled from "styled-components";
import DatePicker from 'react-date-picker';
import "./_override-react-date-picker.css";
import Label from "./Label";
import {useDispatch, useSelector} from "react-redux";
import {setEmail, setFilter, setName, setTransactions} from "../actions/actions";
import {selectEmail, selectFilterDates} from "../selectors/selectors";


const FilterButton = styled.button`
  min-width:80px;
  height:50%;
  font-size:1rem;
  
  border-radius: 5px;
  border: 2px solid black;
  
  background-color: #5eafff;
  box-sizing: border-box;
  cursor:pointer;
  margin-left:5px;
`;

const Filter = styled.section`
  width: 100%;
  height: 8%;
  border: 3px solid purple;
  box-sizing: border-box;
  // margin: 2px;
  display: flex;
  justify-content:space-evenly;
  align-items: center;
`;

const FilterSection = styled.div`
  width:50%;
  height:100%;
  box-sizing:border-box;
  display:flex;
  align-items: center;
  padding:0 2%; 
  justify-content:${props => props.type === "left" ? "flex-start" : "flex-end"};
`;

const FilterTransactions = (props) => {
  const dispatch = useDispatch();
  const filterDates = useSelector(selectFilterDates);
  const [startDate, setStartDate] = useState(filterDates.startDate);
  const [endDate, setEndDate] = useState(filterDates.endDate);
  const email = useSelector(selectEmail);

  const updatFilters = (event) => {
    event.preventDefault();
    dispatch(setFilter({startDate, endDate}));

    fetch('/api/get-transactions', {
      method: 'POST',
      body: JSON.stringify({email: email, startDate: startDate, endDate: endDate}),
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


  return (
    <Filter>
      <FilterSection type="left">
        <Label type="info">Start date</Label>
        <div className={"react-date-picker react-date-picker--closed react-date-picker--enabled date"}>
          <DatePicker
            format={"dd-MM-y"}
            onChange={setStartDate}
            value={startDate}/>
        </div>
        <Label type="info">End date</Label>
        <div className={"react-date-picker react-date-picker--closed react-date-picker--enabled date"}>
          <DatePicker
            format={"dd-MM-y"}
            onChange={setEndDate}
            value={endDate}/>
        </div>
        <FilterButton onClick={updatFilters}>Filter</FilterButton>
      </FilterSection>
      <FilterSection>
        <Label type="info">Expenses</Label>
        <Label>4000Rs</Label>
        <Label type="info">Income</Label>
        <Label>8000Rs</Label>
        <Label type="info">Balance</Label>
        <Label>4000Rs</Label>
      </FilterSection>
    </Filter>)
};

export default FilterTransactions;