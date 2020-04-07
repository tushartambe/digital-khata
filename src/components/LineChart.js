import styled from "styled-components";
import React from "react";
import {Line} from "react-chartjs-2";
import {useSelector} from "react-redux";
import {selectExpenses, selectIncome} from "../selectors/selectors";

const ChartArea = styled.section`
  width:100%;
  height:50%;
  display:flex;
  flex-direction: column;
  align-items:center;  
  justify-content:center;
`;

const LineChart = () => {
  const expenses = useSelector(selectExpenses);
  const income = useSelector(selectIncome);

  const state = {
    datasets: [
      {
        label: 'Expenses',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'red',
        borderWidth: 2,
        data: expenses.map(o => ({x: o.date, y: o.amount}))
      },
      {
        label: 'Income',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'red',
        borderColor: 'green',
        borderWidth: 2,
        data: income.map(o => ({x: o.date, y: o.amount}))
      }
    ]
  };

  return (
    <ChartArea>
      <Line
        data={state}
        options={{
          responsive: true,
          title: {
            display: true,
            text: "Income vs Expense",
            fontSize: 20
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'MMM DD'
              },
              ticks: {
                source: "auto"
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }}
      />
    </ChartArea>
  )
};

export default LineChart;