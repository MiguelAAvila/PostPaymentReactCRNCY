import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
    
        // Set up event listener for localStorage changes
        const handleStorageChange = (event) => {
          if (event.key === 'token') {
            setToken(event.newValue); // Update token state when it changes
          }
        };
    
        // Attach storage event listener
        window.addEventListener('storage', handleStorageChange);
        if (storedToken) {
          setToken(storedToken);
        }
        setLoading(false);
    
        // Cleanup the event listener when the component unmounts
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);

      useEffect( () => {
        if(!loading && !token){
            logout()
        }
      }, [loading, token])

    const login = (newToken, userName, userId, companyId) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', userName);
        localStorage.setItem('userId', userId);
        localStorage.setItem('companyId', companyId);
        setToken(newToken);
        setUser(userName);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('companyId');
        setToken(null);
        setUser(null);
    };

    const contextValue = {
        token,
        setToken,
        loading,
        login,
        logout,
        user,
        setUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;