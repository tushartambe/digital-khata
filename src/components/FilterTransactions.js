import React, {useState} from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "./_override-react-date-picker.css";
import Label from "./Label";
import {useDispatch} from "react-redux";
import {SET_FILTER, setFilter} from "../actions/actions";


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
  margin: 2px;
  display: flex;
  align-items: center;
`;

const FilterTransactions = (props) => {
  let date = new Date();
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(date.setDate(date.getDate() - 10));
  const [endDate, setEndDate] = useState(new Date());

  return (
    <Filter>
      <Label type="info">Start date</Label>
      <DatePicker
        className="date"
        selected={startDate}
        onChange={setStartDate}/>
      <Label type="info">End date</Label>
      <DatePicker
        className="date"
        selected={endDate}
        onChange={setEndDate}/>
      <FilterButton onClick={() => dispatch(setFilter({startDate, endDate}))}>Filter</FilterButton>
    </Filter>)
};

export default FilterTransactions;