import React from 'react';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectTransactions} from "../../selectors/selectors";
import Header from "../Header";
import TransactionPopup from "./TransactionPopup";
import {Avatar, Card} from "antd";
import 'antd/dist/antd.css';
import {DeleteTwoTone, EditTwoTone} from '@ant-design/icons';

const {Meta} = Card;

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
  padding: 5px;
`;

const TransactionSummary = (props) => {
  const transactions = useSelector(selectTransactions);
  const styles = {
    "income": {color: '#5f9249', backgroundColor: '#c3e8b4'},
    "expense": {color: '#f56a00', backgroundColor: '#fde3cf'}
  };
  return (
    <ChartArea>
      <Transactions>
        <Header>Transactions</Header>
        <TransactionPopup/>
        {transactions.map((t, i) =>
          (
            <Card
              size="small"
              style={{width: "100%", borderColor: "grey", marginBottom: "2px"}}
              actions={[
                <EditTwoTone key="edit"/>,
                <DeleteTwoTone key="delete" twoToneColor="red"/>
              ]}>
              <Meta
                avatar={<Avatar size={64} style={styles[t.type]}>{t.amount}</Avatar>}
                title={t.category}
                description={new Date(t.date).toLocaleDateString("en-GB")}/>
            </Card>
          )
        )}
      </Transactions>
    </ChartArea>
  )
};
export default TransactionSummary;