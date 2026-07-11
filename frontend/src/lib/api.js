import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Bearer Token if present in LocalStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prepai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized Global API Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Parse standardized backend error structure
    const responseData = error.response?.data;
    const message = responseData?.message || 'An unexpected network error occurred. Please try again.';
    const errors = responseData?.errors || [];

    // Formulate a structured error package for consumption by contexts and components
    const parsedError = {
      status: error.response?.status || 500,
      message,
      errors,
      originalError: error
    };

    // If 401 Unauthorized, trigger session cleaning
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('prepai_token');
      window.dispatchEvent(new CustomEvent('prepai_unauthorized', { detail: parsedError }));
    }

    return Promise.reject(parsedError);
  }
);

export default api;
