// SpendingGraph.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './SpendingGraph.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Transaction {
  timestamp: string; // Ensure format is 'YYYY-MM-DD'
  amount: number;
}

interface SpendingGraphProps {
  transactions: Transaction[];
}

const SpendingGraph: React.FC<SpendingGraphProps> = ({ transactions }) => {
  // Sort transactions by timestamp
  const sortedTransactions = transactions.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  // Calculate daily totals
  const dailyTotals = sortedTransactions.reduce((acc, { timestamp, amount }) => {
    const date = timestamp.split('T')[0]; // Adjust if your timestamp format includes time
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {});

  // Calculate cumulative totals
  let cumulativeTotal = 0;
  const cumulativeTotals = Object.values(dailyTotals).map(amount => {
    cumulativeTotal += amount;
    return cumulativeTotal;
  });

  const chartData = {
    labels: Object.keys(dailyTotals),
    datasets: [
      {
        label: 'Cumulative Spending',
        data: cumulativeTotals,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cumulative Amount Spent Throughout the Month',
      },
    },
    responsive: true,
  };

  return <Line options={options} data={chartData} />;
};

export default SpendingGraph;
