import React, {useState} from "react";
import styled from "styled-components";
import "./_override-react-date-picker.css";
import Label from "./Label";
import {useDispatch, useSelector} from "react-redux";
import {setEmail, setFilter, setName, setTransactions} from "../actions/actions";
import {selectEmail, selectFilterDates, selectTransactions} from "../selectors/selectors";
import {Button, DatePicker} from 'antd';
import moment from "moment";
import {FilterOutlined} from "@ant-design/icons";

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

  const transactions = useSelector(selectTransactions);
  const getSummary = ({expense, income}, transaction) => {
    transaction.type === "expense" ? expense += transaction.amount : income += transaction.amount;
    return {expense, income};
  };
  let {expense, income} = transactions.reduce(getSummary, {expense: 0, income: 0});

  const updateFilters = (event) => {
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

  const onDateChange = (dates, dateStrings) => {
    dates && setStartDate(dates[0]._d);
    dates && setEndDate(dates[1]._d);
  };

  return (
    <Filter>
      <FilterSection type="left">
        <DatePicker.RangePicker defaultValue={[moment(startDate), moment(endDate)]} format={"DD-MM-YYYY"}
                                onChange={onDateChange}/>
        <Button type="primary" icon={<FilterOutlined/>} onClick={updateFilters}>Filter</Button>
      </FilterSection>
      <FilterSection>
        <Label type="info">Expenses</Label>
        <Label>{"₹"}{expense}</Label>
        <Label type="info">Income</Label>
        <Label>{"₹"}{income}</Label>
        <Label type="info">Balance</Label>
        <Label>{"₹"}{income - expense}</Label>
      </FilterSection>
    </Filter>)
};

export default FilterTransactions;