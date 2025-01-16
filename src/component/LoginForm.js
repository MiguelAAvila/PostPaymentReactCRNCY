import React, { useState, useContext, useLayoutEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {
  const [LogonName, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Add state for error message
  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');  // Clear any previous error message
    try {
      const response = await axios.post("/api/api/authenticate", { LogonName: LogonName, password: password });
      await login(response.data.Token, response.data.User.LogonName, response.data.User.UserId, response.data.User.CompanyId);
      if (response.status === 200) { // Check for successful status code
        navigate('/home');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password. Please try again.');  // Set error message on failure
    }
  };

  useLayoutEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={LogonName}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error} {/* Display the error message */}
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
