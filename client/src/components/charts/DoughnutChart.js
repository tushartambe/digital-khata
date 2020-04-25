import styled from "styled-components";
import React, {useState} from "react";
import {Doughnut} from "react-chartjs-2";
import {useSelector} from "react-redux";
import {selectUniqueExpenses, selectUniqueIncome} from "../../selectors/selectors";
import {Radio} from "antd";

const Wrap = styled.div`
  margin:20px 0;
  display:flex;
  justify-content : space-evenly;
`;

const DoughnutChart = (props) => {
  const uniqueExpenses = useSelector(selectUniqueExpenses);
  const uniqueIncome = useSelector(selectUniqueIncome);

  const [currentCategory, setCurrentCategory] = useState("expense");
  const [showExpense, setShowExpense] = useState(true);

  const state = {
    labels: showExpense ? uniqueExpenses.map(e => e.category) : uniqueIncome.map(e => e.category),
    datasets: [
      {
        backgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4'
        ],
        hoverBackgroundColor: [
          '#501800',
          '#4B5000',
          '#175000',
          '#003350',
          '#35014F'
        ],
        data: showExpense ? uniqueExpenses.map(e => e.amount) : uniqueIncome.map(e => e.amount)
      }
    ]
  };

  const toTitleCase = (title) => {
    const FirstChar = title[0].toUpperCase();
    const remaining = title.split("").splice(1);
    return FirstChar + remaining.join("");
  };

  const toggle = (event) => {
    setShowExpense(!showExpense);
    setCurrentCategory(event.target.value);
  };
  return (
    <div>
      <Doughnut
        width={null}
        height={null}
        data={state}
        options={{
          maintainAspectRatio: false ,
          responsive: true,
          title: {
            display: true,
            text: toTitleCase(currentCategory),
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        }}
      />
      <Wrap>
        <Radio.Group value={currentCategory} buttonStyle="solid" onChange={toggle} size="large">
          <Radio.Button value="expense">Show Expense</Radio.Button>
          <Radio.Button value="income">Show Income</Radio.Button>
        </Radio.Group>
      </Wrap>
    </div>
  )
};

export default DoughnutChart;
