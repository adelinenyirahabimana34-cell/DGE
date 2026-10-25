import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  config => config,
  error => Promise.reject(error),
);

// Response interceptor — normalize errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const msg = error.response.data?.error || error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(msg));
    } else if (error.request) {
      return Promise.reject(new Error('Cannot reach server. Check your network and that the server is running.'));
    }
    return Promise.reject(error);
  },
);

// Inject token dynamically
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
