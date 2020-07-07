import styled from "styled-components";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectExpenses, selectIncome } from "../../selectors/selectors";
import ReactEcharts from "echarts-for-react";
import { Radio } from "antd";

const Wrap = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-evenly;
`;

const LineChart = () => {
  const expenses = useSelector(selectExpenses);
  const income = useSelector(selectIncome);
  const [currentCategory, setCurrentCategory] = useState("expense");
  const [showExpense, setShowExpense] = useState(true);

  const toggle = (event) => {
    setShowExpense(!showExpense);
    setCurrentCategory(event.target.value);
  };

  let expenseDates = expenses.map((o) => new Date(o.date).toDateString());
  let incomeDates = income.map((o) => new Date(o.date).toDateString());
  let expenseData = expenses.map((o) => o.amount);
  let incomeData = income.map((o) => o.amount);

  let option = {
    title: {
      text: showExpense ? "Expenses" : "Income",
      x: "center",
    },
    color: showExpense ? "#D53A35" : "#3398DB",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: [
      {
        type: "category",
        data: showExpense ? expenseDates : incomeDates,
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Expenses",
        type: "bar",
        barWidth: "50%",
        data: showExpense ? expenseData : incomeData,
      },
    ],
  };

  return (
    <div>
      <ReactEcharts option={option}></ReactEcharts>
      <Wrap>
        <Radio.Group
          value={currentCategory}
          buttonStyle="solid"
          onChange={toggle}
          size="large"
        >
          <Radio.Button value="expense">Show Expense</Radio.Button>
          <Radio.Button value="income">Show Income</Radio.Button>
        </Radio.Group>
      </Wrap>
    </div>
  );
};

export default LineChart;
