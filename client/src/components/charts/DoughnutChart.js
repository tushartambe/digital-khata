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

const DoughnutChart = (props) => {
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
        name: "Donut chart",
        type: "pie",
        radius: ["50%", "80%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "30",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
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

export default DoughnutChart;
