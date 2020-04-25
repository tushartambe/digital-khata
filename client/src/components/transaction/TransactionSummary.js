import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectCategories, selectEmail, selectFilterDates, selectTransactions} from "../../selectors/selectors";
import TransactionPopup from "./TransactionPopup";
import {Table} from "antd";
import 'antd/dist/antd.css';
import TransactionModalForm from "./TransactionModalForm";
import {setEmail, setName, setTransactions} from "../../actions/actions";
import {DeleteTwoTone, EditTwoTone, MinusCircleTwoTone, PlusCircleTwoTone} from '@ant-design/icons';


const TransactionSummary = (props) => {
  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectCategories);
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

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        {text: "Income", value: "income"},
        {text: "Expense", value: "expense"}
      ],
      onFilter: (value, record) => record.type === value,
      render: text => text === "income" ? <PlusCircleTwoTone twoToneColor={"#6ca653"} style={{fontSize: 28}}/> :
        <MinusCircleTwoTone twoToneColor={'#f56a00'} style={{fontSize: 28}}/>
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: {
        compare: (a, b) => a.amount - b.amount
      },
      render: text => <span>{text.toLocaleString('en-IN', {style: 'currency', currency: 'INR'})}</span>
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: {
        compare: (a, b) => new Date(a.date) - new Date(b.date)
      },
      render: (text, record) => (
        <span>{new Date(text).toLocaleDateString("en-IN")}</span>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: categories.map(e => {
        return {text: e.name, value: e.name}
      }),
      onFilter: (value, record) => record.category === value
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          {id === record._id &&
          <TransactionModalForm
            initialValues={{
              amount: record.amount,
              date: record.date,
              type: record.type,
              expenseCategory: record.type === "expense" ? record.category : undefined,
              incomeCategory: record.type === "income" ? record.category : undefined,
              description: record.description
            }}
            visible={visible}
            onCreate={onCreate}
            onCancel={() => {
              setVisible(false);
            }}
          />
          }
          <EditTwoTone style={{fontSize: 22, marginRight: 16, cursor: "pointer"}}
                       onClick={() => {
                         setId(record._id);
                         setVisible(!visible);
                       }}
          />
          <DeleteTwoTone twoToneColor="red" style={{fontSize: 22, cursor: "pointer"}}
                         onClick={() => {
                           deleteTransaction(record._id)
                         }}
          />
        </span>
      ),
    }];

  return (
    <div>
      <TransactionPopup/>
      <Table columns={columns}
             expandable={{
               expandedRowRender: record => <span><h4>Description : </h4>{record.description}</span>
             }}
             dataSource={transactions}
             pagination={false}
             size={"small"}
      />
    </div>)
};
export default TransactionSummary;