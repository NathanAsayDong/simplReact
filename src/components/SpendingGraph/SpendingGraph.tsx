import React, { useState } from 'react';
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
  // State for tracking the current month (0 = January, 11 = December)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  // Function to get the month name from the month number
  const getMonthName = (monthNumber: number) => {
    return new Date(0, monthNumber).toLocaleString('default', { month: 'long' });
  };

  // Filter transactions for the current month and sort by date
  const filteredSortedTransactions = transactions
    .filter(transaction => {
      const transactionDate = new Date(transaction.timestamp);
      return transaction.amount > 0 && transactionDate.getMonth() === currentMonth;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Calculate daily totals for positive transactions only
  const dailyTotals = filteredSortedTransactions.reduce((acc, { timestamp, amount }) => {
    const date = new Date(timestamp).toLocaleDateString('en-US'); // Convert to 'MM/DD/YYYY' format
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {});

  // Calculate cumulative totals for the filtered transactions
  let cumulativeTotal = 0;
  const cumulativeTotals = Object.values(dailyTotals).map((amount) => {
    cumulativeTotal += amount;
    return cumulativeTotal;
  });

  const chartData = {
    labels: Object.keys(dailyTotals),
    datasets: [
      {
        label: `Cumulative Spending for ${getMonthName(currentMonth)}`,
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
        text: `Cumulative Amount Spent in ${getMonthName(currentMonth)}`,
      },
    },
    responsive: true,
  };

  // Handler to move to the previous month
  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  // Handler to move to the next month
  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  return (
    <>
      <Line options={options} data={chartData} />
      <div className="month-navigation">
        <button onClick={handlePrevMonth}>Previous Month</button>
        <button onClick={handleNextMonth}>Next Month</button>
      </div>
    </>
  );
};

export default SpendingGraph;
