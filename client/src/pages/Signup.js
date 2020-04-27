import React, {useState} from "react";
import {Link} from "react-router-dom";
import Wrapper from "../components/Wrapper";
import 'antd/dist/antd.css';
import {LockTwoTone, MailTwoTone, SmileTwoTone} from '@ant-design/icons';
import styled from "styled-components";
import {Button, Form, Input, Layout, Typography} from "antd";
import CommonFooter from "../components/CommonFooter";
import CommonHeader from "../components/CommonHeader";
import {layoutStyle} from "../CommonStyles";

const {Content} = Layout;
const {Title} = Typography;

const Container = styled.div`
height:100vh;
display:flex;
justify-content:center;
align-items:center;
`;

const Signup = ({history}) => {
  const [email, setLocalEmail] = useState("");
  const [name, setLocalName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({name, email, password}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          history.push('/login');
        } else {
          throw new Error(res.error);
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error Creating Account please try again');
      });
  };

  return (
    <Layout style={layoutStyle}>
      <CommonHeader/>
      <Content style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Wrapper>
          <Title level={4}>Sign Up</Title>
          <Form
            name="normal_signup"
            initialValues={{
              remember: true,
            }}
          >
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please enter your Name!',
                },
              ]}
            >
              <Input prefix={<SmileTwoTone className="site-form-item-icon"/>}
                     placeholder="Your Name"
                     onChange={e => setLocalName(e.target.value)}/>
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: 'Please enter your Email!',
                },
              ]}
              hasFeedback
            >
              <Input prefix={<MailTwoTone className="site-form-item-icon"/>}
                     placeholder="yourmail@domain.com"
                     onChange={e => setLocalEmail(e.target.value)}/>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your password!',
                },
              ]}
              hasFeedback
            >
              <Input.Password prefix={<LockTwoTone className="site-form-item-icon"/>}
                              placeholder="Password"/>
            </Form.Item>

            <Form.Item
              name="confirm"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockTwoTone className="site-form-item-icon"/>}
                placeholder="Confirm Password"
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type={"primary"} onClick={onSubmit} block>Create Account</Button>
              Already have an account? <Link to="/login">Log in</Link>
            </Form.Item>
          </Form>
        </Wrapper>
      </Content>
      <CommonFooter/>
    </Layout>
  );
}
export default Signup;