import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSummary, createExpense } from '../api/client';

interface SummaryFormProps {}

interface Summary {
  id?: number;
  category: string;
  totalAmount: number;
  month: string;
  year: number;
}

const SummaryForm: React.FC<SummaryFormProps> = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<Summary>({
    category: '',
    totalAmount: 0,
    month: '',
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchSummary = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getSummary();
          const summary = response.find((item: Summary) => item.id === parseInt(id));
          if (summary) {
            setFormData(summary);
          } else {
            setError('Summary not found.');
          }
        } catch (err) {
          setError('Failed to fetch summary.');
        } finally {
          setLoading(false);
        }
      };

      fetchSummary();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'totalAmount' || name === 'year' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createExpense(formData);
      navigate('/summary');
    } catch (err) {
      setError('Failed to save summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Summary' : 'Add Summary'}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Total Amount</label>
          <input
            type="number"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Month</label>
          <input
            type="text"
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Year</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="border border-gray-300 rounded px-4 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default SummaryForm;