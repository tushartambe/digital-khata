import { FilterOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Modal, message } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEmail,
  selectFilterDates,
  selectIsMobileScreen,
} from "../selectors/selectors";
import moment from "moment";
import {
  setEmail,
  setFilter,
  setName,
  setTransactions,
} from "../actions/actions";

const Filters = () => {
  const [visible, setVisible] = useState(false);
  const filterDates = useSelector(selectFilterDates);
  const [startDate, setStartDate] = useState(filterDates.startDate);
  const [endDate, setEndDate] = useState(filterDates.endDate);
  const dispatch = useDispatch();
  const email = useSelector(selectEmail);
  const isMobileScreen = useSelector(selectIsMobileScreen);

  const layout = !isMobileScreen ? "inline" : "";

  const updateFilters = (event) => {
    event.preventDefault();
    dispatch(setFilter({ startDate, endDate }));
    fetch("/api/get-transactions", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        startDate: startDate,
        endDate: endDate,
      }),
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
        dispatch(setName(res.name));
        dispatch(setEmail(res.email));
        dispatch(setTransactions(res.transactions));
      })
      .catch((err) => {
        console.error(err);
        message.error("Some Error. Refresh the page");
      });
  };

  const formDom = () => {
    const [form] = Form.useForm();

    return (
      <Form
        name="filters"
        form={form}
        layout={layout}
        initialValues={{
          startDate: moment(startDate),
          endDate: moment(endDate),
        }}
      >
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[
            {
              required: true,
              message: "Please select Start Date!",
            },
          ]}
        >
          <DatePicker
            format={"DD-MM-YYYY"}
            onChange={(date, dateString) => {
              date && setStartDate(date._d);
            }}
          />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          dependencies={["starDate"]}
          rules={[
            {
              required: true,
              message: "Please select End Date!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("startDate")._d < value._d) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "End Date cannot be lesser than start date"
                );
              },
            }),
          ]}
        >
          <DatePicker
            format={"DD-MM-YYYY"}
            onChange={(date, dateString) => {
              date && setEndDate(date._d);
            }}
          />
        </Form.Item>
        {!isMobileScreen && (
          <Form.Item shouldUpdate={true}>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
                onClick={updateFilters}
              >
                Apply Filter
                <FilterOutlined />
              </Button>
            )}
          </Form.Item>
        )}
      </Form>
    );
  };
  return (
    <div style={{ display: "flex", marginBottom: "10px" }}>
      {isMobileScreen ? (
        <Modal
          title="Apply Filters"
          visible={visible}
          onOk={(e) => {
            updateFilters(e);
            setVisible(false);
          }}
          onCancel={() => {
            setVisible(false);
          }}
        >
          {formDom()}
        </Modal>
      ) : (
        formDom()
      )}
      {isMobileScreen && (
        <Button
          type="primary"
          onClick={(event) => {
            setVisible(true);
            updateFilters(event);
          }}
        >
          Apply Filter
          <FilterOutlined />
        </Button>
      )}
    </div>
  );
};
export default Filters;
