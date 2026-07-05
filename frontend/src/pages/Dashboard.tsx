import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSummary, listExpenses, listCategories } from '../api/client';
import { SummaryResponse } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Array<{ id: number; name: string; amount: number }>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const summaryData = await getSummary();
        setSummary(summaryData);

        const expensesData = await listExpenses();
        setRecentExpenses(expensesData.slice(0, 5)); // Show only the 5 most recent expenses
      } catch (err: any) {
        setError('Failed to fetch dashboard data.');
        toast.error('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'addExpense':
        navigate('/expenses');
        break;
      case 'addCategory':
        navigate('/categories');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Categories</h2>
          <p className="text-2xl font-bold">{summary?.totalCategories || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Expenses</h2>
          <p className="text-2xl font-bold">{summary?.totalExpenses || 0}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Spent</h2>
          <p className="text-2xl font-bold">${summary?.totalSpent.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
        <div className="bg-white shadow rounded-lg p-4">
          {recentExpenses.length > 0 ? (
            <ul>
              {recentExpenses.map((expense) => (
                <li key={expense.id} className="flex justify-between py-2 border-b last:border-b-0">
                  <span>{expense.name}</span>
                  <span>${expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent expenses found.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleQuickAction('addExpense')}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
          >
            Add Expense
          </button>
          <button
            onClick={() => handleQuickAction('addCategory')}
            className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600"
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;