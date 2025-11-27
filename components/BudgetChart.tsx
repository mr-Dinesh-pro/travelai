import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BudgetBreakdown } from '../types';

interface BudgetChartProps {
  budget: BudgetBreakdown;
}

// Professional Travel Theme: Blue, Sky, Indigo, Violet, Orange
const COLORS = ['#0284c7', '#38bdf8', '#6366f1', '#8b5cf6', '#f97316'];

export const BudgetChart: React.FC<BudgetChartProps> = ({ budget }) => {
  const data = [
    { name: 'Stay', value: budget.accommodation },
    { name: 'Food', value: budget.food },
    { name: 'Travel', value: budget.transportation },
    { name: 'Activities', value: budget.activities },
    { name: 'Misc', value: budget.misc },
  ];

  const formatCurrency = (value: number) => {
    return `${budget.currency} ${value.toLocaleString()}`;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            cornerRadius={4}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontFamily: 'Outfit, sans-serif',
              color: '#1e293b'
            }}
            itemStyle={{ color: '#1e293b' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 600 }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};