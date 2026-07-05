import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listExpenses as getExpenses, deleteExpense } from '../api/client';

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
}

const ExpensesList: React.FC = () => {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getExpenses();
        setItems(response);
      } catch (err) {
        setError('Failed to fetch expenses.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteExpense(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete expense.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <button
          onClick={() => navigate('/expenses/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      <input
        type="text"
        placeholder="Search expenses..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Category</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2">{item.amount}</td>
              <td className="border border-gray-300 px-4 py-2">{item.category}</td>
              <td className="border border-gray-300 px-4 py-2">{item.date}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesList;