import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link } from "react-router-dom";
const {log} = console;
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
const Signup = (props) => {
  log("COming here");
  return (
    <Wrapper>
      <Header>Create Account</Header>
      <Input type="email" placeholder="yourmail@domain.com"></Input>
      <Input type="password" placeholder="password"></Input>
      <Input type="password" placeholder="confirm password"></Input>
      <Button>Create Account</Button>
      <span>Already have an account? <Link to="/">Log in</Link></span>
    </Wrapper>
  );
}
export default Signup;