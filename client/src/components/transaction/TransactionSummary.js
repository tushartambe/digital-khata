import React, {useState} from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {selectEmail, selectFilterDates, selectTransactions} from "../../selectors/selectors";
import Header from "../Header";
import TransactionPopup from "./TransactionPopup";
import {Avatar, Card} from "antd";
import 'antd/dist/antd.css';
import {DeleteTwoTone, EditTwoTone} from '@ant-design/icons';
import TransactionModalForm from "./TransactionModalForm";
import {setEmail, setName, setTransactions} from "../../actions/actions";

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

  const [visible, setVisible] = useState(false);
  const [id, setId] = useState();
  const email = useSelector(selectEmail);
  const filterDates = useSelector(selectFilterDates);
  const dispatch = useDispatch();

  const updateTransactions = () => {
    fetch('/api/get-transactions', {
      method: 'POST',
      body: JSON.stringify({email: email, startDate: filterDates.startDate, endDate: filterDates.endDate}),
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
    }).catch(err => {
      console.error(err);
      alert('Some Error. Refresh the page');
    })
  };


  const addTransaction = ({id, date, amount, type, category, description}) => {
    fetch('/api/update-transaction', {
      method: 'POST',
      body: JSON.stringify({
        id: id,
        email: email,
        amount: amount,
        date: date,
        type: type,
        category: category,
        description: description
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.error);
      } else {
        updateTransactions();
      }
    }).catch(err => {
      alert('Error adding Transaction. Please try again.');
    });
  };

  const deleteTransaction = (id) => {
    fetch('/api/delete-transaction', {
      method: 'POST',
      body: JSON.stringify({
        id,
        email
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.error);
      } else {
        updateTransactions();
      }
    }).catch(err => {
      alert('Error adding Transaction. Please try again.');
    });
  };
  
  const onCreate = values => {
    console.log('Received values of form: ', values);
    console.log(id);
    setVisible(false);
    const v = {
      id: id,
      date: values.date._d,
      amount: values.amount,
      type: values.type,
      category: values.type === "income" ? values.incomeCategory : values.expenseCategory,
      description: values.description
    };
    addTransaction(v);
  };

  return (
    <ChartArea>
      <Transactions>
        <Header>Transactions</Header>
        <TransactionPopup/>
        {transactions.map((t, i) =>
          (<div>
              {id === t._id && <TransactionModalForm
                initialValues={{
                  amount: t.amount,
                  date: t.date,
                  type: t.type,
                  expenseCategory: t.type === "expense" ? t.category : undefined,
                  incomeCategory: t.type === "income" ? t.category : undefined,
                  description: t.description
                }}
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                  setVisible(false);
                }}
              />}
              <Card
                size="small"
                style={{width: "100%", borderColor: "grey", marginBottom: "2px"}}
                actions={[
                  <EditTwoTone key="edit" onClick={() => {
                    setId(t._id);
                    setVisible(true);
                  }}/>,
                  <DeleteTwoTone key="delete" twoToneColor="red" onClick={() => {
                    // setId(t._id);
                    deleteTransaction(t._id);
                  }}/>
                ]}>
                <Meta
                  avatar={<Avatar size={64} style={styles[t.type]}>{t.amount}</Avatar>}
                  title={t.category}
                  description={new Date(t.date).toLocaleDateString("en-GB")}/>
              </Card>
            </div>
          )
        )}
      </Transactions>
    </ChartArea>
  )
};
export default TransactionSummary;