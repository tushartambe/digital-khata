import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectCategories, selectEmail, selectFilterDates} from "../../selectors/selectors";
import {setEmail, setName, setTransactions} from "../../actions/actions";
import {DatePicker, Form, Input, InputNumber, Modal, Select} from "antd";
import moment from "moment";
import FloatPlusButton from "../FloatPlusButton";

const {Option} = Select;

const TransactionPopup = () => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState();
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState("income");

  const categories = useSelector(selectCategories);
  const email = useSelector(selectEmail);
  const filterDates = useSelector(selectFilterDates);
  const dispatch = useDispatch();

  const types = ['income', 'expense'];
  const typeCategories = {
    income: categories.filter(c => c.type === "income").map(c => c.name),
    expense: categories.filter(c => c.type === "expense").map(c => c.name)
  };
  const [category, setCategory] = useState(typeCategories["income"][0]);
  const [showModal, toggleModalShow] = useState(false);

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

  const addTransaction = (event) => {
    event.preventDefault();
    fetch('/api/add-transaction', {
      method: 'POST',
      body: JSON.stringify({
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

  return (
    <div>
      <FloatPlusButton onclick={() => {
        toggleModalShow(true)
      }}/>
      <Modal
        title="Add Transaction"
        visible={showModal}
        onOk={(e) => {
          addTransaction(e);
          toggleModalShow(false);
        }}
        onCancel={() => {
          toggleModalShow(false);
        }}
      >
        <div>
          <Form
            layout={"vertical"}
            name="add-transaction"
            initialValues={{
              type: type,
              date: moment(date),
              incomeCategory: typeCategories["income"][0],
              expenseCategory: typeCategories["expense"][0]
            }}
          >
            <Form.Item
              label="Amount"
              name="amount"
              rules={[
                {
                  required: true,
                  message: 'Please enter amount!',
                },
              ]}
            >
              <InputNumber
                style={{width: "100%"}}
                min={1}
                onChange={(value) => {
                  setAmount(value);
                }}
              />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Please select date!',
                },
              ]}
            >
              <DatePicker
                style={{width: "100%"}}
                onChange={(d) => {
                  d && setDate(d._d);
                }}/>
            </Form.Item>

            <Form.Item
              label="Type"
              name="type"
              value={type}
              rules={[
                {
                  required: true,
                  message: 'Please select type!',
                },
              ]}
            >
              <Select
                value={type}
                onChange={(value) => {
                  setType(value);
                  setCategory(typeCategories[value][0]);
                }}
              >
                {types.map(type => (
                  <Option key={type}>{type}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
            >
              {({getFieldValue}) => {
                return getFieldValue('type') === 'income' ? (
                  <Form.Item
                    name="incomeCategory"
                    label="Category"
                    rules={[{required: true}]}
                  >
                    <Select
                      onChange={(value) => {
                        setCategory(value);
                      }}
                    >
                      {typeCategories.income.map(c => (
                        <Option key={c}>{c}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : <Form.Item
                  name="expenseCategory"
                  label="Category"
                  rules={[{required: true}]}
                >
                  <Select
                    onChange={(value) => {
                      setCategory(value);
                    }}
                  >
                    {typeCategories.expense.map(c => (
                      <Option key={c}>{c}</Option>
                    ))}
                  </Select>
                </Form.Item>;
              }}
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
            >
              <Input
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>)
};

export default TransactionPopup;