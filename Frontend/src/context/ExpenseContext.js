import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // Memoized axios instance with auth header
    const authAxios = useMemo(() => {
        const instance = axios.create({
            baseURL: '/api',
        });

        instance.interceptors.request.use(
            (config) => {
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return instance;
    }, [user?.token]); // Only recreate when token changes

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authAxios.get('/expenses');
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch expenses');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authAxios]);

    const addExpense = useCallback(async (expenseData, imageFile) => {
        try {
            setLoading(true);
            // const formData = new FormData();
            // formData.append('expense', JSON.stringify({
            //     title: expenseData.title,
            //     amount: expenseData.amount,
            //     date: expenseData.date,
            //     category: expenseData.category,
            //     description: expenseData.description
            // }));
            // if (imageFile) {
            //     formData.append('image', imageFile);
            // }
            
            const response = await authAxios.post('/expenses', expenseData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setExpenses(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authAxios]);

    const updateExpense = useCallback(async (id, expenseData) => {
        try {
            setLoading(true);
            const response = await authAxios.put(`/expenses/${id}`, expenseData);
            setExpenses(prev => prev.map(exp => 
                exp.id === id ? response.data : exp
            ));
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update expense');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authAxios]);

    const deleteExpense = useCallback(async (id) => {
        try {
            setLoading(true);
            await authAxios.delete(`/expenses/${id}`);
            setExpenses(prev => prev.filter(exp => exp.id !== id));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete expense');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [authAxios]);

   const getSummary = useCallback(async () => {
    try {
        const response = await authAxios.get('/expenses/summary', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure token is sent
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (err) {
        console.error('Summary error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to get summary');
        throw err;
    }
}, [authAxios]);

    const getExpensesByDate = useCallback(async () => {
        try {
            const response = await authAxios.get('/expenses/by-date');
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get expenses by date');
            throw err;
        }
    }, [authAxios]);

    useEffect(() => {
        if (user) {
            fetchExpenses();
        }
    }, [user, fetchExpenses]);

    const contextValue = useMemo(() => ({
        expenses,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        getSummary,
        getExpensesByDate,
        fetchExpenses
    }), [
        expenses,
        loading,
        error,
        addExpense,
        updateExpense,
        deleteExpense,
        getSummary,
        getExpensesByDate,
        fetchExpenses
    ]);

    return (
        <ExpenseContext.Provider value={contextValue}>
            {children}
        </ExpenseContext.Provider>
    );
};

export const useExpenses = () => useContext(ExpenseContext);