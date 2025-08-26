import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const api = axios.create({
  baseURL: 'http://localhost:8080',
  // withCredentials: true // Only needed if using cookies/sessions
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle unauthorized/forbidden errors
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);
const theme = createTheme({
  palette: {
    mode: 'dark', // or 'light'
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
}

export default api;