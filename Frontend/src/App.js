import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import {PrivateRoute, ProtectedRoute} from './components/PrivateRoute';
import { ExpenseProvider } from './context/ExpenseContext'; 
import AdminExpenseReport from './components/AdminExpenseReport';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ExpenseProvider> 
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="user/dashboard" element={
                            <PrivateRoute requiredRole="ROLE_USER">
                                <Dashboard />
                            </PrivateRoute>
                        } />
                         <Route path="admin/dashboard" element={
                            <ProtectedRoute requiredRole="ROLE_ADMIN">
                                <AdminExpenseReport />
                            </ProtectedRoute>
                        } />
                        <Route path="/" element={<Login />} />
                    </Routes>
                </ExpenseProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;