import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, IconButton, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Stack
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useExpenses } from '../context/ExpenseContext';

const categories = ['FOOD', 'TRANSPORT', 'HOUSING', 'ENTERTAINMENT', 'UTILITIES', 'OTHERS'];

const ExpenseList = () => {
  const { expenses, deleteExpense, updateExpense } = useExpenses();
  const [editOpen, setEditOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [editedExpense, setEditedExpense] = useState({
    title: '',
    amount: 0,
    date: '',
    category: 'FOOD',
    description: ''
  });

  const handleEditClick = (expense) => {
    setCurrentExpense(expense);
    setEditedExpense({
      title: expense.title,
      amount: expense.amount,
      date: expense.date.split('T')[0], // Format date for input[type="date"]
      category: expense.category,
      description: expense.description
    });
    setEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      await updateExpense(currentExpense.id, {
        ...editedExpense,
        date: new Date(editedExpense.date).toISOString() // Convert back to ISO format
      });
      setEditOpen(false);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Your Expenses
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.title}</TableCell>
                <TableCell>RM {expense.amount.toFixed(2)}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(expense)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(expense.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Expense</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: '400px' }}>
            <TextField
              name="title"
              label="Title"
              value={editedExpense.title}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="amount"
              label="Amount (RM)"
              type="number"
              value={editedExpense.amount}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              value={editedExpense.date}
              onChange={handleEditChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              margin="normal"
            />
            <TextField
              name="category"
              label="Category"
              select
              value={editedExpense.category}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="description"
              label="Description"
              multiline
              rows={3}
              value={editedExpense.description}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseList;