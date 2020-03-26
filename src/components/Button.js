import React from "react";
import styled from "styled-components";

const Button = styled.button`
  width:100%;
  height:40px;
  background: transparent;
  border-radius: 5px;
  border: 2px solid black;
  margin: 0.2rem;
  background-color: ${props => props.type == "info" ? "#5eafff" : "white"};
  cursor:pointer;
`
export default Button;