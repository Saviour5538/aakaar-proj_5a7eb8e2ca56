import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, getCategory, updateCategory } from '../api/client';

interface CategoryFormValues {
  name: string;
  description: string;
}

const CategoriesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formValues, setFormValues] = useState<CategoryFormValues>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        setLoading(true);
        setError(null);
        try {
          const category = await getCategory(Number(id));
          setFormValues({
            name: category.name,
            description: category.description,
          });
        } catch (err) {
          setError('Failed to fetch category.');
        } finally {
          setLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await updateCategory(Number(id), formValues);
      } else {
        await createCategory(formValues);
      }
      navigate('/categories');
    } catch (err) {
      setError('Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Category' : 'Add New Category'}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriesForm;