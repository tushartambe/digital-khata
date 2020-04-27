import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectEmail} from "../selectors/selectors";
import DoughnutChart from "../components/charts/DoughnutChart";
import LineChart from "../components/charts/LineChart";
import TransactionSummary from "../components/transaction/TransactionSummary";
import CategoryList from "../components/category/CategoryList";
import {setCategories, setEmail, setName, setTransactions} from "../actions/actions";
import {
  CheckSquareOutlined,
  DatabaseOutlined,
  HomeOutlined,
  LineChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import {Layout, Menu} from 'antd';
import Summary from "../components/Summary";
import {layoutStyle} from "../CommonStyles";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";

const {Content, Sider} = Layout;

const Dashboard = (props) => {
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
    home: (<Summary/>),
    transactions: (<TransactionSummary/>),
    categories: (<CategoryList/>),
    lineChart: (<LineChart/>),
    pieChart: (<DoughnutChart/>)
  };

  const [selectedActivity, setSelectedActivity] = useState("home");
  const selectActivity = ({item, key, keyPath, domEvent}) => {
    setSelectedActivity(key);
  };
  return (
    <Layout style={layoutStyle}>
      <CommonHeader isLoggedIn={true} logout={logout}/>
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
          <Menu theme="dark" mode="inline" onClick={selectActivity} defaultSelectedKeys={["home"]}>
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
        </Content>
      </Layout>
      <CommonFooter/>
    </Layout>
  )
};

export default Dashboard;