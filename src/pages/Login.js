import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, Redirect } from "react-router-dom";

const Wrapper = styled.div`
  width:100vw; 
  padding:10px 50px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
  border:1px solid black;
  box-sizing:border-box;
  
  @media (min-width: 768px) {
    max-width: 400px;
  }
`
const Login = (props) => {
  console.log("Coming in login")
  return (
    <Wrapper>
      <Header>Log In</Header>
      <Input type="email" placeholder="yourmail@domain.com"></Input>
      <Input type="password" placeholder="your password"></Input>
      <Input type="Submit"></Input>
      <span>Don't have an account? <Link to="/c">Create One</Link></span>
    </Wrapper>
  );
}
export default Login;