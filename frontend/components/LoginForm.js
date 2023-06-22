import React, { useState, useEffect } from 'react'
import PT from 'prop-types'
import { useNavigate } from 'react-router-dom'



const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm(props) {
  const [values, setValues] = useState(initialFormValues)
  const [disabled, setDisabled] = useState(true)
  // ✨ where are my props? Destructure them here

//   // if(localStorage.getItem('token') === null){
//     useNavigate('/')
 
  
// }

  useEffect(() => {
    
    setDisabled(values.username.trim().length >=3 && values.password.trim().length >=8)
  })



  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    console.log(onSubmit)
    evt.preventDefault()
    // ✨ implement
    props.login({
     username:values.username, 
     password:values.password})
    
  }

  

  return (
    <form id="loginForm" onSubmit={onSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />
      <button disabled={(!disabled)}  id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired,
}
