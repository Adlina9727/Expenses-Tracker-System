import React, { useState } from 'react';
import { 
  Button, TextField, MenuItem, 
  Input, FormControl, InputLabel,Box
} from '@mui/material';
import { useExpenses } from '../context/ExpenseContext';

const categories = [
  'FOOD',
  'TRANSPORT',
  'HOUSING',
  'ENTERTAINMENT',
  'UTILITIES',
  'OTHERS'
];

const AddExpenseForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'FOOD',
        description: ''
    });
    const [image, setImage] = useState(null);
    const { addExpense, loading } = useExpenses();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const expenseData = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                date: formData.date,
                category: formData.category,
                description: formData.description
            };

            const formDataToSend = new FormData();
            formDataToSend.append('expense', JSON.stringify(expenseData));
            if (image) {
                formDataToSend.append('image', image);
            }

            await addExpense(formDataToSend);
            
            // Reset form
            setFormData({
                title: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                category: 'FOOD',
                description: ''
            });
            setImage(null);
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
        <TextField
    
        margin="normal"
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        fullWidth
        size="small"
      />
      
      <TextField
        margin="normal"
        label="Amount (RM)"
        name="amount"
        type="number"
        value={formData.amount}
        onChange={handleChange}
        required
        fullWidth
        size="small"
      />
      
      <TextField
        margin="normal"
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
        fullWidth
        size="small"
      />
      
      <TextField
        margin="normal"
        select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        fullWidth
        size="small"
      >
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
      
      <TextField
        margin="normal"
        label="Description"
        name="description"
        multiline
        rows={3}
        value={formData.description}
        onChange={handleChange}
        fullWidth
        size="small"
      />
      
      <FormControl margin="normal" fullWidth>
        <InputLabel shrink>Receipt Image (Optional)</InputLabel>
        <Input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          inputProps={{ accept: 'image/*' }}
        />
      </FormControl>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
        fullWidth
      >
        {loading ? 'Adding...' : 'Add Expense'}
      </Button>
    </form>
    </Box>
  );
};

export default AddExpenseForm;