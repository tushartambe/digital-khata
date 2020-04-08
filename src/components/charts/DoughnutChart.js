import styled from "styled-components";
import React, {useState} from "react";
import {Doughnut} from "react-chartjs-2";
import {useSelector} from "react-redux";
import {selectExpenses, selectIncome} from "../../selectors/selectors";

const ChartArea = styled.section`
  width:100%;
  height:50%;
  display:flex;
  flex-direction: column;
  align-items:center;  
  justify-content:center;
  border-top:1px solid gray;
`;

const Wrap = styled.div`
  width:50%;
  display:flex;
  justify-content : space-evenly;
`;

const getUniqueData = (transactions) => {
  let counts = transactions.reduce((prev, curr) => {
    let count = prev.get(curr.category) || 0;
    prev.set(curr.category, curr.amount + count);
    return prev;
  }, new Map());

  return [...counts].map(([category, amount]) => {
    return {category, amount}
  })
};

const DoughnutChart = (props) => {
  const expenses = useSelector(selectExpenses);
  const income = useSelector(selectIncome);
  const uniqueExpenses = getUniqueData(expenses);
  const uniqueIncome = getUniqueData(income);

  const [labels, setLabels] = useState(uniqueExpenses.map(e => e.category));
  const [data, setData] = useState(uniqueExpenses.map(e => e.amount));
  const [currentCategory, setCurrentCategory] = useState("Expenses");

  const state = {
    labels: labels,
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
        data: data
      }
    ]
  };

  const showExpenses = () => {
    setLabels(uniqueExpenses.map(e => e.category));
    setData(uniqueExpenses.map(e => e.amount));
    setCurrentCategory("Expenses");
  };

  const showIncome = () => {
    setLabels(uniqueIncome.map(e => e.category));
    setData(uniqueIncome.map(e => e.amount));
    setCurrentCategory("Income");
  };

  return (
    <ChartArea>
      <Doughnut
        data={state}
        options={{
          title: {
            display: true,
            text: currentCategory,
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'bottom'
          }
        }}
      />
      <Wrap>
        <input type={"button"} onClick={showExpenses} value={"Expenses"}/>
        <input type={"button"} onClick={showIncome} value={"Income"}/>
      </Wrap>
    </ChartArea>
  )
};

export default DoughnutChart;
