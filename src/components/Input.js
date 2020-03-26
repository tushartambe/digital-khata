import React from "react";
import styled from "styled-components";

const Input = styled.input.attrs(props => ({
    type: props.type
}))`
  width:100%;
  height:40px;
  background: transparent;
  border-radius: 5px;
  border: 2px solid black;
  box-sizing:border-box;
  text-align:center;
  margin: 0.2rem;
  background-color: ${props => props.type == "info" ? "#5eafff" : "white"};
`
export default Input;