import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {selectEmail, selectName} from "../selectors/selectors";
import FilterTransactions from "../components/FilterTransactions";
import DoughnutChart from "../components/charts/DoughnutChart";
import LineChart from "../components/charts/LineChart";
import TransactionSummary from "../components/transaction/TransactionSummary";
import CategoryList from "../components/category/CategoryList";
import {setCategories, setEmail, setName, setTransactions} from "../actions/actions";
import {PoweroffOutlined} from "@ant-design/icons";
import {Button, Popconfirm} from "antd";

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
  padding:0 5%;
  
  display:flex;
  align-items:center;
  justify-content:space-between;
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
  const [loading, setLoading] = useState(true);
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();

  useEffect(() => {
    loading && fetch('/api/get-initial-data', {
      method: 'POST',
      body: JSON.stringify({email}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
      } else {
        throw new Error(res.error);
      }
      return res.json();
    }).then(res => {
      dispatch(setName(res.name));
      dispatch(setEmail(res.email));
      dispatch(setCategories(res.categories));
      dispatch(setTransactions(res.transactions));
      setLoading(false)
    }).catch(err => {
      console.error(err);
    })
  });

  const logout = (event) => {
    event.preventDefault();
    fetch('/api/logout', {
      method: 'POST'
    })
      .then(res => {
        if (res.status === 200) {
          props.history.push('/login');
        } else {
          throw new Error(res.error);
        }
      }).catch(err => {
      console.error(err);
    });
  };

  return (
    !loading &&
    <DashboardWrapper>
      <Heading>
        <span>Hello {name}</span>
        <Popconfirm
          title="Do you really want to logout?"
          icon={<PoweroffOutlined/>}
          onConfirm={logout}
          placement="bottomRight"
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="danger"
            icon={<PoweroffOutlined/>}
          >
            Logout
          </Button>
        </Popconfirm>
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