import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants';

const STORAGE_KEY_API_URL = '@dg_api_base_url';
let activeBaseUrl = API_BASE_URL;

const api = axios.create({
  baseURL: activeBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize stored URL on module load
AsyncStorage.getItem(STORAGE_KEY_API_URL).then(savedUrl => {
  if (savedUrl && savedUrl.trim().length > 0) {
    activeBaseUrl = savedUrl.trim();
    api.defaults.baseURL = activeBaseUrl;
  }
}).catch(() => {});

// Request interceptor — ensure latest dynamic baseURL and attach auth token
api.interceptors.request.use(
  async config => {
    if (activeBaseUrl) {
      config.baseURL = activeBaseUrl;
    }
    return config;
  },
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
      return Promise.reject(
        new Error(`Cannot reach server at ${activeBaseUrl}. Make sure your phone and PC are on the same Wi-Fi and server is running.`),
      );
    }
    return Promise.reject(error);
  },
);

// Get current active base URL
export async function getActiveApiUrl(): Promise<string> {
  const saved = await AsyncStorage.getItem(STORAGE_KEY_API_URL);
  return saved || activeBaseUrl;
}

// Update active base URL dynamically at runtime
export async function setActiveApiUrl(newUrl: string): Promise<void> {
  const sanitized = newUrl.trim().replace(/\/+$/, '');
  activeBaseUrl = sanitized;
  api.defaults.baseURL = sanitized;
  await AsyncStorage.setItem(STORAGE_KEY_API_URL, sanitized);
}

// Inject token dynamically
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
