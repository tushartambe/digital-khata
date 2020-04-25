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
// import {PoweroffOutlined} from "@ant-design/icons";
// import {Button, Popconfirm} from "antd";

import {
  CheckSquareOutlined,
  DatabaseOutlined,
  FacebookFilled,
  GithubFilled,
  HomeOutlined,
  InstagramOutlined,
  LineChartOutlined,
  PieChartOutlined,
  UserOutlined,
  PoweroffOutlined,
  FilterOutlined
} from '@ant-design/icons';
import {Button, Layout, Menu, Space, Popover, Popconfirm, Typography, DatePicker} from 'antd';

const {Title} = Typography;
const {Header, Content, Footer, Sider} = Layout;

// import "antd/dist/antd.css";

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

  const components = {
    transactions: (<TransactionSummary/>),
    categories: (<CategoryList/>),
    lineChart: (<LineChart/>),
    pieChart: (<DoughnutChart/>)
  };

  const [selectedActivity, setSelectedActivity] = useState();
  const selelectActivity = ({item, key, keyPath, domEvent}) => {
    setSelectedActivity(key);
  };

  // return (
  //   !loading &&
  //   <DashboardWrapper>
  //     <Heading>
  //       <span>Hello {name}</span>
  //       <Popconfirm
  //         title="Do you really want to logout?"
  //         icon={<PoweroffOutlined/>}
  //         onConfirm={logout}
  //         placement="bottomRight"
  //         okText="Yes"
  //         cancelText="No"
  //       >
  //         <Button
  //           type="danger"
  //           icon={<PoweroffOutlined/>}
  //         >
  //           Logout
  //         </Button>
  //       </Popconfirm>
  //     </Heading>
  //     <FilterTransactions/>
  //     <Container>
  //       <TransactionSummary/>
  //       <ChartArea>
  //         <LineChart/>
  //         <DoughnutChart/>
  //       </ChartArea>
  //       <CategoryList/>
  //     </Container>
  //   </DashboardWrapper>
  // )

  return (
    <Layout style={{width: "100%", height: "100vh"}}>
      <Header style={{padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Title level={3} style={{color: "white", margin: 0}}> Digital Khata </Title>
        <Popover placement="bottomRight" content={<div>
          <p>Hello User</p>
          <p><Button type="danger" icon={<PoweroffOutlined/>} onClick={logout}>Logout</Button></p>
        </div>} trigger="click">
          <Button style={{background: "transparent"}} icon={<UserOutlined style={{color: "white"}}/>} shape={"circle"}/>
        </Popover>
      </Header>
      <Layout>
        <Sider
          breakpoint="xs"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <Menu theme="dark" mode="inline" onClick={selelectActivity}>
            <Menu.Item key="home">
              <HomeOutlined/>
              <span>Summary</span>
            </Menu.Item>
            <Menu.Item key="transactions">
              <DatabaseOutlined/>
              <span>Transactions</span>
            </Menu.Item>
            <Menu.Item key="categories">
              <CheckSquareOutlined/>
              <span>Categories</span>
            </Menu.Item>
            <Menu.Item key="pieChart">
              <PieChartOutlined/>
              <span>Pie Chart</span>
            </Menu.Item>
            {window.innerWidth > 600 &&
            <Menu.Item key="lineChart">
              <LineChartOutlined/>
              <span>Line Chart</span>
            </Menu.Item>
            }
          </Menu>
        </Sider>
        <Content style={{margin: '10px 5px 0'}}>
          {components[selectedActivity]}
          {/* <TransactionsMobile></TransactionsMobile> */}
          {/*<Filters></Filters>*/}
          {/*<Transactions></Transactions>*/}
          {/* <DoughnutChart></DoughnutChart> */}
          {/*<FloatButton></FloatButton>*/}
        </Content>
      </Layout>
      <Footer theme="dark" style={{textAlign: 'center', padding: "10px 10px"}}>
        <Space>
          <Button type="primary" shape="circle" icon={<GithubFilled/>}/>
          <Button type="primary" shape="circle" icon={<InstagramOutlined/>}/>
          <Button type="primary" shape="circle" icon={<FacebookFilled/>}/>
        </Space>
      </Footer>
    </Layout>
  )
};

export default Dashboard;