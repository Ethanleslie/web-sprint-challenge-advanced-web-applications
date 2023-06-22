import React from 'react'
import { Route, useNavigate} from 'react-router-dom'
import LoginForm from './LoginForm'

const PrivateRoute = ({children}) => {
    const navigate = useNavigate()
    const getToken = localStorage.getItem('token')
    if(getToken !== null) {
        return (children)
    }else {
        return <LoginForm/>
        
    }
}

export default PrivateRoute