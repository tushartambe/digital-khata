import React, {useState} from "react";
import "../transaction/TransactionPopup.css"
import {setCategories, setEmail, setName} from "../../actions/actions";
import {useDispatch, useSelector} from "react-redux";
import {selectEmail} from "../../selectors/selectors";
import {Button, Form, Input, Modal, Select, message} from "antd";

const {Option} = Select;

const CategoryPopup = ({history}) => {
  const [category, setCategory] = useState("")
  const [type, setType] = useState("income");
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();
  const types = ["income", "expense"];
  const [showModal, toggleModalShow] = useState(false);

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
      dispatch(setName(res.name));
      dispatch(setEmail(res.email));
      dispatch(setCategories(res.categories));
    }).catch(err => {
      console.error(err);
      alert('Some Error. Refresh the page');
    })
  };

  const addCategory = (event) => {
    event.preventDefault();
    toggleModalShow(false);
    fetch('/api/add-category', {
      method: 'POST',
      body: JSON.stringify({email: email, type: type, name: category, emoji: ""}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) {
        throw new Error(res.error);
      } else {
        updateCategories();
        message.success("Category Added Successfully!")
      }
    }).catch(err => {
      console.error(err);
      message.error("Error adding Category!")
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => {
        toggleModalShow(true)
      }}>
        Add New Category
      </Button>
      <Modal
        title="Add Category"
        visible={showModal}
        onCancel={() => {
          toggleModalShow(false)
        }}
        footer={[
          <Button key="submit" type="primary" onClick={addCategory}>
            Add Category
          </Button>,
        ]}
      >
        <Form
          name="add-category"
          initialValues={{
            type: type
          }}
        >
          <Form.Item
            label="Type"
            name="type"
            rules={[
              {
                required: true,
                message: 'Please select type!',
              },
            ]}
          >
            <Select
              style={{width: 120}}
              onChange={(value) => {
                setType(value)
              }}
            >
              {types.map(t => (
                <Option key={t}>{t}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: 'Please enter category name!',
              },
            ]}
          >
            <Input placeholder={"New Category Name"}
                   onChange={(event) => {
                     setCategory(event.target.value)
                   }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
};

export default CategoryPopup;