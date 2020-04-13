import React, {useState} from "react";
import Header from "../components/Header";
import {Input} from "../components/Input";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setEmail, setName} from "../actions/actions";
import Wrapper from "../components/Wrapper";


const Login = ({history}) => {
  const [email, SetLocalEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/authenticate', {
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
        return res.json();
      }).then(res => {
      dispatch(setName(res.name));
      dispatch(setEmail(email));
    }).catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  };

  return (
    <Wrapper>
      <Header>Log In</Header>
      <form onSubmit={onSubmit}>
        <Input type="email"
               placeholder="yourmail@domain.com"
               value={email}
               onChange={e => SetLocalEmail(e.target.value)}/>
        <Input type="password"
               placeholder="your password"
               value={password}
               onChange={e => setPassword(e.target.value)}/>
        <Input type="submit" value="Login"/>
        <span>Don't have an account? <Link to="/signup">Create One</Link></span>
      </form>
    </Wrapper>
  );
};
export default Login;