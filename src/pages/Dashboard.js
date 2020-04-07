import React from 'react';
import {useSelector} from "react-redux";
import styled from "styled-components";
import {selectName} from "../selectors/selectors";
import "react-datepicker/dist/react-datepicker.css";
import FilterTransactions from "../components/FilterTransactions";
import PieChart from "../components/PieChart";
import LineChart from "../components/LineChart";

const DashboardWrapper = styled.div`
  width:100%;
  height:100%;
`;

const Heading = styled.section`
  width:100%;
  height:8%;
  border:3px solid blue;
  box-sizing:border-box;
  font-size:30px;
  margin:2px;
`;

const Container = styled.section`
  width:100%;
  height:84%;
  border:3px solid blue;
  box-sizing:border-box;
  margin:2px;
  display:flex;
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
        <PieChart/>
        <LineChart/>
      </Container>
    </DashboardWrapper>
  )
};

export default Dashboard;