import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ExpenseChart = ({ data }) => {
    const chartData = Object.entries(data).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <Box sx={{ height: 300 }}>
            <Typography variant="h6" gutterBottom>
                Expense Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `RM ${value.toFixed(2)}`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default ExpenseChart;