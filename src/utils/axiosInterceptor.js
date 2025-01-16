import axios from 'axios';

// in charge of intercepting calls to API to inject the header auth
const axiosInstance = axios.create({
    baseURL: '/api'
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        console.log("Token retrieved from localStorage:", token);  // Check token value

        // Add the custom headers
        if (token) { 
            config.headers.Token = token;  // Static Token from your curl example
            config.headers['Content-Type'] = 'application/json';  // Static Content-Type header
        } else {
            console.log("No token found, skipping custom headers.");
        }

        console.log("Request config with custom headers:", config);  // Log request config
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => { // expired token or wrong token provided
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized - token may be expired or invalid.");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
