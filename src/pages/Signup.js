import React, {useState} from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Input from "../components/Input";
import {Link} from "react-router-dom";

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
`;

const Signup = ({history}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Pasword not matched');
    } else {
      fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify({email, password}),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 200) {
            history.push('/dashboard');
          } else {
            throw new Error(res.error);
          }
        })
        .catch(err => {
          console.error(err);
          alert('Error logging in please try again');
        });
    }
  };

  return (
    <Wrapper>
      <form onSubmit={onSubmit}>
        <Header>Create Account</Header>
        <Input type="email"
               placeholder="yourmail@domain.com"
               value={email}
               onChange={e => setEmail(e.target.value)}
        />
        <Input type="password"
               placeholder="password"
               value={password}
               onChange={e => setPassword(e.target.value)}
        />
        <Input type="password"
               placeholder="confirm password"
               value={confirmPassword}
               onChange={e => setConfirmPassword(e.target.value)}
        />
        <Input type="submit" value="Create Account"/>
        <span>Already have an account? <Link to="/login">Log in</Link></span>
      </form>
    </Wrapper>
  );
}
export default Signup;