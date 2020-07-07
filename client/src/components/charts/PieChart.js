import styled from "styled-components";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectUniqueExpenses,
  selectUniqueIncome,
} from "../../selectors/selectors";
import { Radio } from "antd";
import ReactEcharts from "echarts-for-react";

const Wrap = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-evenly;
`;

const PieChart = (props) => {
  const uniqueExpenses = useSelector(selectUniqueExpenses);
  const uniqueIncome = useSelector(selectUniqueIncome);

  const [currentCategory, setCurrentCategory] = useState("expense");
  const [showExpense, setShowExpense] = useState(true);

  const toggle = (event) => {
    setShowExpense(!showExpense);
    setCurrentCategory(event.target.value);
  };

  let state = {
    data: showExpense
      ? uniqueExpenses.map((o) => {
          return { value: o.amount, name: o.category };
        })
      : uniqueIncome.map((o) => {
          return { value: o.amount, name: o.category };
        }),
    labels: showExpense
      ? uniqueExpenses.map((e) => e.category)
      : uniqueIncome.map((e) => e.category),
  };

  let option = {
    title: {
      text: showExpense ? "Expenses" : "Income",
      x: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "horizontal",
      bottom: 5,
      data: state.labels,
    },
    series: [
      {
        name: "Pie Chart",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        labelLine: {
          show: true,
        },
        data: state.data,
      },
    ],
  };

  return (
    <div>
      <ReactEcharts option={option} />
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

export default PieChart;
