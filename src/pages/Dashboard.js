import React from 'react';
import {useSelector} from "react-redux";
import styled from "styled-components";
import {selectName} from "../selectors/selectors";
import "react-datepicker/dist/react-datepicker.css";
import FilterTransactions from "../components/FilterTransactions";
import DoughnutChart from "../components/DoughnutChart";
import LineChart from "../components/LineChart";
import TransactionSummary from "../components/TransactionSummary";
import CategoryList from "../components/CategoryList";

const DashboardWrapper = styled.div`
  width:86%;
  height:100%;
  margin: 0 auto;
`;

const Heading = styled.section`
  width:100%;
  height:8%;
  border:3px solid blue;
  box-sizing:border-box;
  font-size:30px;
`;

const Container = styled.section`
  width:100%;
  height:84%;
  border:3px solid blue;
  box-sizing:border-box;
  margin:0 auto;
  display:flex;
`;

const ChartArea = styled.section`
  width:50%;
  height:100%;
  display:flex;
  flex-direction: column;
  align-items:center;  
  justify-content:space-evenly;
`;

const Dashboard = (props) => {
  const name = useSelector(selectName);

  return (
    <DashboardWrapper>
      <Heading>
        Hello {name}
      </Heading>
      <FilterTransactions/>
      <Container>
        <TransactionSummary/>
        <ChartArea>
          <LineChart/>
          <DoughnutChart/>
        </ChartArea>
        <CategoryList/>
      </Container>
    </DashboardWrapper>
  )
};

export default Dashboard;