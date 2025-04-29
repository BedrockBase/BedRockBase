import { supabase } from './supabaseClient';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
});

// Add authorization header interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/signin';
          return Promise.reject(error);
        }
        const response = await authAPI.refreshToken(refreshToken);
        const { access } = response.data;

        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;

        return api(originalRequest);
      } catch (err) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
login: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
},
    
  refreshToken: (refresh: string) => 
    api.post('/auth/token/refresh/', { refresh }),
    
  logout: () => {
    const refresh = localStorage.getItem('refresh_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return api.post('/auth/token/blacklist/', { token: refresh });
  }
};

export default api;
