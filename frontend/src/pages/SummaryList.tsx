import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSummary, deleteExpense } from '../api/client';

interface Summary {
  id: number;
  category: string;
  totalAmount: number;
  month: string;
  year: number;
}

const SummaryList: React.FC = () => {
  const [items, setItems] = useState<Summary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getSummary();
        setItems(response);
      } catch (err) {
        setError('Failed to fetch summaries.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteExpense(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete summary.');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Summary List</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search by category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 mr-4"
        />
        <button
          onClick={() => navigate('/summary/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New
        </button>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Month</th>
              <th className="border border-gray-300 px-4 py-2">Year</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                <td className="border border-gray-300 px-4 py-2">{item.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">{item.month}</td>
                <td className="border border-gray-300 px-4 py-2">{item.year}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SummaryList;