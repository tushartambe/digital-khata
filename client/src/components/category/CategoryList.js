import React from 'react';
import styled from "styled-components";
import Header from "../Header";
import CategoryPopup from "./CategoryPopup";
import {selectCategories, selectEmail} from "../../selectors/selectors";
import {useDispatch, useSelector} from "react-redux";
import {List, message, Typography} from "antd";
import {DeleteTwoTone, MinusCircleTwoTone, PlusCircleTwoTone} from '@ant-design/icons';
import {setCategories} from "../../actions/actions";

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
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();

  const colors = {
    income: ["#5f9249", "#c3e8b4", "#9fd986"],
    expense: ['#f56a00', '#fde3cf', "#f78833"]
  };

  const updateCategories = () => {
    fetch('/api/get-categories', {
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
      dispatch(setCategories(res.categories));
    }).catch(err => {
      console.error(err);
      alert('Some Error. Refresh the page');
    })
  };

  const deleteCategory = (id) => {
    fetch('/api/delete-category', {
      method: 'POST',
      body: JSON.stringify({
        id,
        email
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.error);
      } else {
        updateCategories();
        message.success("Category deleted successfully");
      }
    }).catch(err => {
      message.error("Unable to delete category");
    });
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
                                     style={{fontSize: 22}}
                                     onClick={() => {
                                       deleteCategory(item._id);
                                     }}
            />]}
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