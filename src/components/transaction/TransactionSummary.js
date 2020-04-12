import React, {useState} from 'react';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectTransactions} from "../../selectors/selectors";
import Header from "../Header";
import TransactionPopup from "./TransactionPopup";
import Modal from "../Modal";

const ChartArea = styled.section`
  width:30%;
  height:100%;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  border:3px solid blue;
  overflow-y: auto;
  box-sizing:border-box;
`;

const Transactions = styled.div`
  width:100%;
  height:100%;
  overflow-y:scroll;
  box-sizing:border-box;
`;

const Transaction = styled.div`
  width:99%;
  height:60px;
  mix-height:60px;
  
  display: flex;
  justify-content: space-between;
  align-items: center;

  box-sizing:border-box;
  margin:5px 2px 5px 2px;
  padding: 0 10px 0 10px;
  border-width:1px;
  border-style: solid;
  border-color:black;
  border-radius:60px;
  // border-color:${props => props.type === "expense" ? "#EF4037" : "darkgreen"};
  // background-color: ${props => props.type === "expense" ? "#FBB03B" : "#8CC63F"};
  font-weight:bold;
  color:${props => props.type === "expense" ? "#EF4037" : "darkgreen"};
`;


const TransactionSummary = (props) => {
  const transactions = useSelector(selectTransactions);

  return (
    <ChartArea>
      <Transactions>
        <Header>Transactions</Header>
        <Modal><TransactionPopup/></Modal>
        {transactions.map((t, i) => (
          <Transaction type={t.type} key={i}><span>{t.date}</span> <span>{t.category}</span>
            <span>{t.type === "expense" ? "- " : "+ "}{t.amount}</span></Transaction>))}
      </Transactions>
    </ChartArea>
  )
};
export default TransactionSummary;