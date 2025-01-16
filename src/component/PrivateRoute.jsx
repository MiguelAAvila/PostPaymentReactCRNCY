import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

//Unless token is present, user will be prompted to login from authContext
const PrivateRoute = () => {
    const { token, loading } = useAuth(); // Use the hook
    const [userLogin, setUserLogin] = useState(false);
    const navigate = useNavigate()

    useEffect( () => {
        if(!token){
            setUserLogin(false)
        } else {
            setUserLogin(true)
            navigate("/")
        }
    }, [token, navigate])

    if (loading) {
        return <div>Loading...</div>;
    }

    return userLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;