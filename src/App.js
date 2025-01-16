import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './component/AuthContext';
import PrivateRoute from './component/PrivateRoute';
import HomePage from './app/Home';
import LoginPage from './app/Login';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<HomePage />} /> 
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;