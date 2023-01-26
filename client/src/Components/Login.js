import axios from 'axios';
import React, { useState } from 'react'
import Input from './Input';


const Login = ({ setToken }) => {
  const [password, setPassword] = useState()
  const handleChange = (e) => {
    setPassword(e.target.value)
  }
  const login = async () => {
    const token = await axios.post("http://localhost:8800/login", {password})
    return token;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await login();
    setToken(token.data)
  }
  return (
    <div className='password'>
        Enter password
        <Input name = 'password' id = 'password'
        placeholder = '' defaultValue = '' change = { handleChange } />
        <button onClick={(e) => handleSubmit(e)}> Login </button>
    </div>
  )
}

export default Login