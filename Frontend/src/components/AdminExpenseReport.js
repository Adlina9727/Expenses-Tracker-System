import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminExpenseReport = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0); 
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserExpenses(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setUsers(response.data);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserExpenses = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/expenses?userId=${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setExpenses(response.data);
    } catch (error) {
      setError('Failed to fetch expenses');
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ms-MY', { 
    style: 'currency',
    currency: 'MYR',
  }).format(amount);
};
  // Prepare data for charts
  const getCategoryData = () => {
    const categoryMap = {};
    
    expenses.forEach(expense => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));
  };

  // Prepare data for monthly chart
  const getMonthlyData = () => {
    const monthlyMap = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (monthlyMap[monthYear]) {
        monthlyMap[monthYear] += expense.amount;
      } else {
        monthlyMap[monthYear] = expense.amount;
      }
    });

    return Object.entries(monthlyMap).map(([name, value]) => ({
      name,
      value
    }));
  };

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading && users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h4" component="h2" gutterBottom color="primary">
              Admin Expense Report
            </Typography>
            <Typography variant="h6" gutterBottom>
              Welcome back, <strong>{user?.username}</strong>
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ textTransform: 'none' }}
          >
            Logout
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="user-select-label">Select User</InputLabel>
          <Select
            labelId="user-select-label"
            id="user-select"
            value={selectedUserId}
            label="Select User"
            onChange={(e) => setSelectedUserId(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="">
              <em>-- Select a User --</em>
            </MenuItem>
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.username} ({user.email})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedUserId && expenses.length > 0 && (
          <Box sx={{ mt: 2, textAlign: 'right', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Total Amount: {formatCurrency(totalAmount)}
            </Typography>
          </Box>
        )}

        {selectedUserId && expenses.length > 0 && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Table View" />
              <Tab label="Chart View" />
              <Tab label="Monthly Analysis" />
            </Tabs>
          </Box>
        )}

        {selectedUserId && (
          <Box>
            {expenses.length === 0 ? (
              <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                No expenses found for this user.
              </Typography>
            ) : (
              <>
                {activeTab === 0 && (
                  <TableContainer component={Paper} elevation={2}>
                    <Table sx={{ minWidth: 650 }} aria-label="expenses table">
                      <TableHead>
                        <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                          <TableCell><strong>Date</strong></TableCell>
                          <TableCell><strong>Title</strong></TableCell>
                          <TableCell><strong>Amount</strong></TableCell>
                          <TableCell><strong>Category</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {expenses.map(expense => (
                          <TableRow 
                            key={expense.id}
                            sx={{ 
                              '&:last-child td, &:last-child th': { border: 0 },
                              '&:hover': { backgroundColor: theme.palette.action.hover }
                            }}
                          >
                            <TableCell>{formatDate(expense.date)}</TableCell>
                            <TableCell>{expense.title}</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.success.dark }}>
                              {formatCurrency(expense.amount)}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={expense.category} 
                                color="primary" 
                                variant="outlined" 
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {activeTab === 1 && categoryData.length > 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={2} sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom align="center">
                          Expense Distribution by Category
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper elevation={2} sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom align="center">
                          Top Expense Categories
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[...categoryData].sort((a, b) => b.value - a.value).slice(0, 5)}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${value}`} />
                            <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" name="Amount" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Paper>
                    </Grid>
                  </Grid>
                )}

                {activeTab === 2 && monthlyData.length > 0 && (
                  <Paper elevation={2} sx={{ p: 2, height: 400 }}>
                    <Typography variant="h6" gutterBottom align="center">
                      Monthly Expense Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                        <Legend />
                        <Bar dataKey="value" fill="#00C49F" name="Monthly Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                )}
              </>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminExpenseReport;