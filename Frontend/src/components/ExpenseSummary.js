// ExpenseSummary.js
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const ExpenseSummary = ({ summary }) => {
    const total = Object.values(summary).reduce((sum, amount) => sum + amount, 0);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Expense Summary
            </Typography>
            
            <List>
                {Object.entries(summary).map(([category, amount]) => (
                    <ListItem key={category}>
                        <ListItemText 
                            primary={category} 
                            secondary={`RM ${amount.toFixed(2)}`} 
                        />
                    </ListItem>
                ))}
            </List>
            
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                Total: RM {total}
            </Typography>
        </Box>
    );
};

export default ExpenseSummary;