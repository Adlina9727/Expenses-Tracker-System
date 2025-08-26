import React, { createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
   

   useEffect(() => {
    const initializeAuth = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('auth'));
            if (authData?.token) {
                const response = await axios.get('/api/auth/current-user', {
                    headers: {
                        Authorization: `Bearer ${authData.token}`
                    }
                });
                if (response.data) {
                    setUser({
                        email: response.data.email,
                        username: response.data.username,
                        token: authData.token,
                        // role: response.data.role
                    });
                }
            }
        } catch (error) {
            localStorage.removeItem('auth');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    // Actually call the function
    initializeAuth();
}, []);
    

    const register = async (username, email, password, confirmPassword) => {
        try {
            setError(null);
            await axios.post('/api/auth/register', {
                username,
                email,
                password,
                confirmPassword: confirmPassword,
            }, {
                withCredentials: true
                //headers: {
                //'Content-Type': 'application/json'
                //}
            });
            navigate('/login');
            return { success: true };
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Registration failed';
            setError(errorMsg);
            throw new Error(errorMsg);
        }
    };

  const login = async (email, password) => {
    try {
        setError(null);
        const response = await axios.post('/api/auth/login', {
            email,
            password
        });
        
        if (!response.data?.token) {
            throw new Error('Authentication failed: No token received');
        }

        console.log('Login response:', response.data);

        const userData = {
            email: response.data.email,
            username: response.data.username,
            token: response.data.token,
            role: response.data.role? response.data.role : 'ROLE_USER'
        };
        
        setUser(userData);
        localStorage.setItem('auth', JSON.stringify(userData));
          // Redirect based on role
            if (userData.role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }
        return userData.role;
    } catch (error) {
        const errorMsg = error.response?.data?.message || 
                      (error.response?.status === 403 ? 'Invalid credentials' : 
                      'Login failed. Please try again.');
        setError(errorMsg);
        throw error;
    }
};
    const logout = async () => {
        try {
            await axios.post('/api/auth/logout', {}, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setUser(null);
            localStorage.removeItem('auth');
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setError('Logout failed. Please try again.');
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            error,
            register, 
            login, 
            logout,
            setError // Allow components to clear errors
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};