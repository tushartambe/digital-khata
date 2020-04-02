import React from 'react';
import Header from "../components/Header";
import {useSelector} from "react-redux";
import {selectName} from "../selectors/selectors";

const Dashboard = (props) => {
  const name = useSelector(selectName);

  return (
    <Header>Hello {name}</Header>
  )
}
export default Dashboard;