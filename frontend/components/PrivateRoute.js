import React from 'react'
import { Route, useNavigate} from 'react-router-dom'



const PrivateRoute = ({children}) => {
    const navigate = useNavigate()
    const getToken = localStorage.getItem('token')
    if(getToken !== null) {
        return (children)
    }else {
        return navigate("/")
        
    }
}

export default PrivateRoute