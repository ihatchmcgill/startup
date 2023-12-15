import React from 'react';

import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export function Login({ updateAuthState }) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function login() {
    console.log('logging in', userName, password)
    //post request for user
    const authResponse = await authenticateUser({username: userName, password: password})
    if (authResponse) {
        localStorage.setItem("currUser", JSON.stringify(authResponse))
        //CHANGE STATE OF AUTH
        updateAuthState('Authenticated')
        navigate('/feed')
    }else{
        alert("Login failed. Please check your credentials.");
    }
}

async function authenticateUser(creds){
  try{
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(creds) 
      })
      if(response.ok){
          const user = await response.json()
          return user
      }else{
          return false
      }
  }catch(e){
      console.log(e)
      return false;
  }
}


  return (
    <>
    <div id="form-container" className="container">
      <ul id="login-form">
          <li>
              <label>Username: </label>
              <input type="text" 
                     id="username" 
                     name="varText" 
                     required pattern=".*"
                     onChange={(e) => setUserName(e.target.value)}/>
          </li>
          <li>
            <label>Password: </label>
            <input type="password" 
                   id="password" 
                   name="varPassword" 
                   required pattern=".*"
                   onChange={(e) => setPassword(e.target.value)}/>
          </li>
      </ul>
      <Button variant='primary' onClick={() => login()}>
        Login
      </Button>
    </div>
    </>
  );
}