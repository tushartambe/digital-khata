import styled from "styled-components";
import React, {useState} from "react";
import {Doughnut} from "react-chartjs-2";
import {useSelector} from "react-redux";
import {selectExpenses, selectIncome, selectUniqueExpenses, selectUniqueIncome} from "../../selectors/selectors";

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

const DoughnutChart = (props) => {
  const uniqueExpenses = useSelector(selectUniqueExpenses);
  const uniqueIncome = useSelector(selectUniqueIncome);

  const [currentCategory, setCurrentCategory] = useState("Expenses");
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

  const showExpenses = () => {
    setShowExpense(true);
    setCurrentCategory("Expenses");
  };

  const showIncome = () => {
    setShowExpense(false);
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
