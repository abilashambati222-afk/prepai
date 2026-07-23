import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  timeout: 45000, // 45 seconds timeout to prevent premature aborts on AI requests
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("prepai_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor: Centralized Global API Error Handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Parse standardized backend error structure
    const responseData = error.response?.data;
    const message = responseData?.message || responseData?.error || 'An unexpected network error occurred. Please try again.';
    const errors = responseData?.errors || [];

    // Formulate a structured error package for consumption by contexts and components
    const parsedError = {
      status: error.response?.status || 500,
      message,
      errors,
      originalError: error
    };

    // If 401 Unauthorized, trigger session cleaning and redirect to login if appropriate
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('prepai_token');
      localStorage.removeItem('prepai_user');
      window.dispatchEvent(new CustomEvent('prepai_unauthorized', { detail: parsedError }));
      
      if (!['/', '/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(parsedError);
  }
);

export default api;
