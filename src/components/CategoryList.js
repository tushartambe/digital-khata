import React from 'react';
import styled from "styled-components";
import {useSelector} from "react-redux";
import {selectCategories, selectTransactions} from "../selectors/selectors";
import Header from "./Header";

const ChartArea = styled.section`
  width:20%;
  height:100%;
  
  display: flex;
  flex-direction: column;
  
  border:3px solid blue;
  overflow-y: auto;
  box-sizing:border-box;
`;


const Categories = styled.div`
  width:100%;
  height:100%;
  overflow-y:scroll;
  box-sizing:border-box;
`;

const Category = styled.div`
  width:99%;
  height:60px;
  mix-height:60px;
  
  display: flex;
  // justify-content: space-evenly;
  align-items: center;

  box-sizing:border-box;
  margin:5px 2px 5px 2px;
  padding: 0 10px 0 10px;
  border-width:1px;
  border-style: solid;
  border-color:black;
  border-radius:60px;
  // border-color:${props => props.type === "expense" ? "#EF4037" : "darkgreen"};
  // background-color: ${props => props.type === "expense" ? "#FBB03B" : "#8CC63F"};
  font-weight:bold;
  color:${props => props.type === "expense" ? "#EF4037" : "darkgreen"};
`;

const Symbol = styled.div`
  width:50px;
  height:50px;
  margin:0;
  text-align:center;
  font-size:2.0rem;
  
  box-sizing:border-box;
  // border:1px solid black;
  border-radius:50%;
  
  display:flex;
  align-items:center;
  justify-content:center;
`;
const CategoryList = (props) => {
  const categories = useSelector(selectCategories);
  return (
    <ChartArea>
      <Header>Categories</Header>
      <Categories>
        {categories.map(c => <Category type={c.type}><Symbol>{c.type === "expense" ? "🎁" : "💰" }</Symbol><span>{c.name}</span></Category>)}
      </Categories>
    </ChartArea>
  )
};
export default CategoryList;