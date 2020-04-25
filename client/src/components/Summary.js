import styled from "styled-components";
import React from "react";
import {Card, Col, Row, Statistic} from "antd";
import {MinusOutlined, PlusOutlined, WalletOutlined} from '@ant-design/icons';
import {useSelector} from "react-redux";
import {selectTransactions} from "../selectors/selectors";

const Wrap = styled.div`
background: #ececec;
padding: 10%;
`;

const Summary = (props) => {
  const transactions = useSelector(selectTransactions);
  const getSummary = ({expense, income}, transaction) => {
    transaction.type === "expense" ? expense += transaction.amount : income += transaction.amount;
    return {expense, income};
  };
  let {expense, income} = transactions.reduce(getSummary, {expense: 0, income: 0});
  return (
    <Wrap>
      <Row gutter={16}>
        <Col span={22}>
          <Card>
            <Statistic
              title="Income"
              value={income}
              precision={2}
              valueStyle={{color: '#3f8600'}}
              prefix={<PlusOutlined/>}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col span={22}>
          <Card>
            <Statistic
              title="Expense"
              value={expense}
              precision={2}
              valueStyle={{color: '#cf1322'}}
              prefix={<MinusOutlined/>}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col span={22}>
          <Card>
            <Statistic
              title="Balance"
              value={income - expense}
              precision={2}
              valueStyle={{color: 'blue'}}
              prefix={<WalletOutlined/>}
              suffix="₹"
            />
          </Card>
        </Col>
      </Row>
    </Wrap>
  );
}

export default Summary;