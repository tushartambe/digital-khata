import React from 'react';
import styled from "styled-components";
import Header from "../Header";
import Modal from "../Modal";
import CategoryPopup from "./CategoryPopup";
import {selectCategories} from "../../selectors/selectors";
import {useSelector} from "react-redux";

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
  align-items: center;

  box-sizing:border-box;
  margin:5px 2px 5px 2px;
  padding: 0 10px 0 10px;
  border-width:1px;
  border-style: solid;
  border-color:black;
  border-radius:60px;
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
      <Modal> <CategoryPopup/></Modal>
      <Categories>
        {categories.map((c, i) => <Category
          type={c.type}
          key={i}><Symbol>{c.type === "expense" ? "🎁" : "💰"}</Symbol><span>{c.name}</span></Category>)}
      </Categories>
    </ChartArea>
  )
};
export default CategoryList;