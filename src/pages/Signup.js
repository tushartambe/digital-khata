import React, {useState} from "react";
import Header from "../components/Header";
import {Input} from "../components/Input";
import {Link} from "react-router-dom";
import Wrapper from "../components/Wrapper";

const Signup = ({history}) => {
  const [email, setLocalEmail] = useState("");
  const [name, setLocalName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Pasword not matched');
    } else {
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
          alert('Error logging in please try again');
        });
    }
  };

  return (
    <Wrapper>
      <form onSubmit={onSubmit}>
        <Header>Create Account</Header>
        <Input type="text"
               placeholder="full name"
               value={name}
               onChange={e => setLocalName(e.target.value)}
        />
        <Input type="email"
               placeholder="yourmail@domain.com"
               value={email}
               onChange={e => setLocalEmail(e.target.value)}
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