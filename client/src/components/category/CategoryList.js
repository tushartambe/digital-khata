import React from "react";
import { selectCategories, selectEmail } from "../../selectors/selectors";
import { useDispatch, useSelector } from "react-redux";
import { setCategories } from "../../actions/actions";
import { message, Table, Tag } from "antd";
import {
  DeleteTwoTone,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from "@ant-design/icons";
import CategoryPopup from "./CategoryPopup";

const CategoryList = (props) => {
  const categories = useSelector(selectCategories);
  const email = useSelector(selectEmail);
  const dispatch = useDispatch();

  const updateCategories = () => {
    fetch("/api/get-categories", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
        } else {
          throw new Error(res.error);
        }
        return res.json();
      })
      .then((res) => {
        dispatch(setCategories(res.categories));
      })
      .catch((err) => {
        console.error(err);
        message.error("Some Error. Refresh the page");
      });
  };

  const deleteCategory = (id) => {
    fetch("/api/delete-category", {
      method: "POST",
      body: JSON.stringify({
        id,
        email,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.error);
        } else {
          updateCategories();
          message.success("Category deleted successfully");
        }
      })
      .catch((err) => {
        message.error("Unable to delete category");
      });
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Income", value: "income" },
        { text: "Expense", value: "expense" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (text) =>
        text === "income" ? (
          <Tag color="#6ca653">
            {" "}
            <PlusCircleTwoTone twoToneColor={"#6ca653"} /> Income{" "}
          </Tag>
        ) : (
          <Tag color="#f56a00">
            {" "}
            <MinusCircleTwoTone twoToneColor={"#f56a00"} /> Expense
          </Tag>
        ),
    },
    {
      title: "Category",
      dataIndex: "name",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <DeleteTwoTone
            twoToneColor="red"
            style={{ fontSize: 22, cursor: "pointer" }}
            onClick={() => {
              deleteCategory(record._id);
            }}
          />
        </span>
      ),
    },
  ];

  return (
    <div>
      <CategoryPopup />
      <Table
        columns={columns}
        dataSource={categories}
        pagination={false}
        size={"middle"}
      />
    </div>
  );
};
export default CategoryList;
