import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
  Menu,
  MenuItem,
  Alert
} from '@mui/material';
import { useExpenses } from '../context/ExpenseContext';
import ExpenseList from '../components/ExpenseList';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseChart from '../components/ExpenseChart';
import LogoutIcon from '@mui/icons-material/Logout';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AnalyticsIcon from '@mui/icons-material/Analytics';


const Dashboard = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { user, logout } = useAuth();
    const { expenses, loading, error, getSummary, getExpensesByDate } = useExpenses();
    const [summary, setSummary] = useState({});
    const [reportAnchorEl, setReportAnchorEl] = useState(null);
    const [ setCategoryData] = useState([]);

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Date formatting function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Simple PDF generation using native browser print
    const generateExpenseReport = () => {
        // Create a printable HTML content
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="text-align: center; color: #2c5282;">EXPENSE TRACKER REPORT</h1>
                <p style="text-align: center;">
                    <strong>Generated on:</strong> ${new Date().toLocaleString()}<br>
                    <strong>User:</strong> ${user.username} (${user.email})
                </p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #2c5282; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Date</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Description</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Category</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${expenses.map(expense => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${formatDate(expense.date)}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${expense.description}</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${expense.category}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">RM ${expense.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background-color: #ebf8ff; font-weight: bold;">
                            <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right;">TOTAL</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">RM ${total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <h3 style="color: #2c5282;">SUMMARY STATISTICS</h3>
                ${(() => {
                    const categoryBreakdown = expenses.reduce((acc, expense) => {
                        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
                        return acc;
                    }, {});

                    return Object.entries(categoryBreakdown).map(([category, amount]) => `
                        <p style="margin: 5px 0;">
                            <strong>${category}:</strong> RM ${amount.toFixed(2)} 
                            (${((amount/total)*100).toFixed(1)}%)
                        </p>
                    `).join('');
                })()}
            </div>
        `;

        // Open print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Expense Report - ${new Date().toLocaleDateString()}</title>
                    <style>
                        @media print {
                            body { margin: 0; }
                            @page { margin: 1cm; }
                        }
                    </style>
                </head>
                <body onload="window.print(); window.onafterprint = function() { window.close(); }">
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const generateCategoryReport = () => {
        const categoryBreakdown = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const totalAmount = Object.values(categoryBreakdown).reduce((sum, amount) => sum + amount, 0);

        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="text-align: center; color: #2c5282;">CATEGORY BREAKDOWN REPORT</h1>
                <p style="text-align: center;">
                    <strong>Generated on:</strong> ${new Date().toLocaleString()}<br>
                    <strong>User:</strong> ${user.username}
                </p>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #2c5282; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Category</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Amount</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(categoryBreakdown).map(([category, amount]) => `
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;">${category}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">RM ${amount.toFixed(2)}</td>
                                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${((amount/totalAmount)*100).toFixed(1)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr style="background-color: #ebf8ff; font-weight: bold;">
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">TOTAL</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">RM ${totalAmount.toFixed(2)}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">100%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Category Report - ${new Date().toLocaleDateString()}</title>
                    <style>
                        @media print {
                            body { margin: 0; }
                            @page { margin: 1cm; }
                        }
                    </style>
                </head>
                <body onload="window.print(); window.onafterprint = function() { window.close(); }">
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const loadData = useCallback(async () => {
        try {
            const summaryData = await getSummary();
            await getExpensesByDate();
            setSummary(summaryData);
            
            // Calculate category data for reports
            const categoryBreakdown = expenses.reduce((acc, expense) => {
                const existingCategory = acc.find(item => item.category === expense.category);
                if (existingCategory) {
                    existingCategory.amount += expense.amount;
                } else {
                    acc.push({
                        category: expense.category,
                        amount: expense.amount
                    });
                }
                return acc;
            }, []);
            setCategoryData(categoryBreakdown);
        } catch (err) {
            console.error('Error loading data:', err);
        }
    }, [getSummary, getExpensesByDate, expenses]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleReportMenuOpen = (event) => {
        setReportAnchorEl(event.currentTarget);
    };

    const handleReportMenuClose = () => {
        setReportAnchorEl(null);
    };

    const handleExpenseReport = () => {
        generateExpenseReport();
        handleReportMenuClose();
    };

    const handleCategoryReport = () => {
        generateCategoryReport();
        handleReportMenuClose();
    };

    if (loading) return <CircularProgress sx={{ display: 'block', margin: '40vh auto' }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ 
            p: isMobile ? 2 : 3,
            minHeight: '100vh',
            background: theme.palette.background.default
        }}>
            {/* Header Section */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mb: 3,
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        Expense Dashboard
                    </Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        Welcome back, <strong style={{ color: theme.palette.primary.main }}>{user?.username}</strong>
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    
                    {/* Report Button */}
                    <Button
                        variant="contained"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleReportMenuOpen}
                        sx={{
                            backgroundColor: theme.palette.success.main,
                            '&:hover': {
                                backgroundColor: theme.palette.success.dark
                            }
                        }}
                    >
                        Reports
                    </Button>

                    <Menu
                        anchorEl={reportAnchorEl}
                        open={Boolean(reportAnchorEl)}
                        onClose={handleReportMenuClose}
                    >
                        <MenuItem onClick={handleExpenseReport}>
                            <PictureAsPdfIcon sx={{ mr: 1 }} /> Expense Report
                        </MenuItem>
                        <MenuItem onClick={handleCategoryReport}>
                            <AnalyticsIcon sx={{ mr: 1 }} /> Category Breakdown
                        </MenuItem>
                    </Menu>

                    {/* Logout Button */}
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LogoutIcon />}
                        onClick={logout}
                        sx={{
                            textTransform: 'none'
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Two-Column Layout */}
            <Grid container spacing={3}>
                {/* Left Column - Takes 8/12 columns on desktop */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ 
                        p: 2, 
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: 3
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                            Spending Overview
                        </Typography>
                        <ExpenseChart data={summary} />
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Last updated: {new Date().toLocaleTimeString()}
                            </Typography>
                            <Chip 
                                label="Live Data" 
                                size="small" 
                                color="success"
                                variant="outlined"
                            />
                        </Box>
                    </Paper>
                    
                    <Paper sx={{ 
                        p: 2, 
                        mb: 2,
                        borderRadius: 2,
                        boxShadow: 3
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            mb: 2 
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Your Expenses
                            </Typography>
                            <Chip 
                                label={`Total: RM ${total.toFixed(2)}`} 
                                color="primary"
                                size="small"
                                sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <ExpenseList />
                    </Paper>
                </Grid>

                {/* Right Column - Takes 4/12 columns on desktop */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ 
                        p: 2, 
                        position: 'sticky', 
                        top: 16,
                        height: 'fit-content',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 2, alignSelf: 'flex-start' }}>
                            Add New Expense
                        </Typography>
                        <AddExpenseForm onSuccess={loadData} />
                        <Divider sx={{ my: 2, width: '100%' }} />
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
                            Track your daily spending
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;