import React from 'react';
import styled from "styled-components";
import Header from "../Header";
import CategoryPopup from "./CategoryPopup";
import {selectCategories} from "../../selectors/selectors";
import {useSelector} from "react-redux";
import {List, Typography} from "antd";
import {DeleteTwoTone, MinusCircleTwoTone, PlusCircleTwoTone} from '@ant-design/icons';

const ChartArea = styled.section`
  width:20%;
  height:100%;
  
  display: flex;
  flex-direction: column;
  
  border:1px solid blue;
  overflow-y: auto;
  box-sizing:border-box;
  padding:0 5px;
`;

const CategoryList = (props) => {
  const categories = useSelector(selectCategories);
  const colors = {
    income: ["#5f9249", "#c3e8b4", "#9fd986"],
    expense: ['#f56a00', '#fde3cf', "#f78833"]
  };

  return (
    <ChartArea>
      <Header>Categories</Header>
      <CategoryPopup/>
      <List
        itemLayout="horizontal"
        dataSource={categories}
        renderItem={item => (
          <List.Item
            style={{
              width: "100%",
              backgroundColor: colors[item.type][1],
              padding: "5px",
              marginBottom: "2px",
              borderRadius: "50px"
            }}
            actions={[<DeleteTwoTone key="list-loadmore-edit" twoToneColor={"red"}
                                     style={{fontSize: 22}}>Delete</DeleteTwoTone>]}
          >
            {item.type === "expense" ? <MinusCircleTwoTone twoToneColor={'#f56a00'} style={{fontSize: 28}}/> :
              <PlusCircleTwoTone twoToneColor={"#6ca653"} style={{fontSize: 28}}/>}
            <Typography.Text style={{
              color: colors[item.type][0],
              fontWeight: "bold",
            }}>{item.name}</Typography.Text>
          </List.Item>
        )}
      >
      </List>
    </ChartArea>
  )
};
export default CategoryList;