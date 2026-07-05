import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Request interceptor to add Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interfaces for request and response types
export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category_id: number;
  date: string;
}

export interface Summary {
  totalExpenses: number;
  categoryBreakdown: { [key: string]: number };
}

// API client functions
export const register = (data: RegisterRequest) => api.post('/api/auth/register', data);

export const login = (data: LoginRequest) => api.post('/api/auth/login', data);

export const createCategory = (name: string) => api.post('/api/categories', { name });

export const listCategories = () => api.get<Category[]>('/api/categories');

export const createExpense = (expense: Omit<Expense, 'id'>) => api.post('/api/expenses', expense);

export const listExpenses = () => api.get<Expense[]>('/api/expenses');

export const deleteExpense = (id: number) => api.delete(`/api/expenses/${id}`);

export const getSummary = () => api.get<Summary>('/api/summary');

// Auto-added stubs for functions a page imported but the client omitted.
export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/api/categorys/${id}`);
  return res.data;
};
export const getCategory = async (id: string) => {
  const res = await api.get(`/api/categorys/${id}`);
  return res.data;
};
export const updateCategory = async (id: string, data?: any) => {
  const res = await api.put(`/api/categorys/${id}`, data);
  return res.data;
};
