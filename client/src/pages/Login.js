import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmail, setName } from "../actions/actions";
import Wrapper from "../components/Wrapper";
import { Button, Form, Input, Layout, Typography, message } from "antd";
import "antd/dist/antd.css";
import { LockTwoTone, MailTwoTone } from "@ant-design/icons";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";

const { Content } = Layout;
const { Title } = Typography;

const Login = ({ history }) => {
  const [email, setLocalEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    fetch("/api/authenticate", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          history.push("/dashboard");
        } else {
          throw new Error(res.error);
        }
        return res.json();
      })
      .then((res) => {
        dispatch(setName(res.name));
        dispatch(setEmail(email));
      })
      .catch((err) => {
        console.error(err);
        message.error("Error logging in please try again");
      });
  };

  return (
    <Layout style={{ width: "100%", height: "100vh" }}>
      <CommonHeader />
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Wrapper>
          <Title level={4}> Log In </Title>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please enter your Email!",
                },
              ]}
              hasFeedback
            >
              <Input
                prefix={<MailTwoTone className="site-form-item-icon" />}
                placeholder="yourmail@domain.com"
                onChange={(e) => setLocalEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your Password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockTwoTone className="site-form-item-icon" />}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <Button type={"primary"} onClick={onSubmit} block>
                Log In
              </Button>
              Don't have an account?<Link to="/signup">Create One</Link>
            </Form.Item>
          </Form>
        </Wrapper>
      </Content>
      <CommonFooter />
    </Layout>
  );
};
export default Login;
