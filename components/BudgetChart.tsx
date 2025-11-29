import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BudgetBreakdown } from '../types';

interface BudgetChartProps {
  budget: BudgetBreakdown;
}

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#f97316', '#10b981'];

export const BudgetChart: React.FC<BudgetChartProps> = ({ budget }) => {
  const data = [
    { name: 'Stay', value: budget.accommodation },
    { name: 'Travel', value: budget.transportation },
    { name: 'Food', value: budget.food },
    { name: 'Activity', value: budget.activities },
    { name: 'Misc', value: budget.misc },
  ];

  return (
    <div className="w-full h-64">
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
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${budget.currency} ${value.toLocaleString()}`}
            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};