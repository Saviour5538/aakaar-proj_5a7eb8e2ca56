import React, { useEffect, useState } from 'react';
import { listCategories as getCategories, deleteCategory } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCategories();
        setCategories(response);
      } catch (err) {
        setError('Failed to fetch categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
    } catch (err) {
      setError('Failed to delete category.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => navigate('/categories/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full"
        />
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {!loading && !error && (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                <td className="border border-gray-300 px-4 py-2">{category.description}</td>
                <td className="border border-gray-300 px-4 py-2">{category.created_at}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
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

export default CategoriesList;