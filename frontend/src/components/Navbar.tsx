import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-lg font-bold">
              SpendWise
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/categories" className="hover:underline">
              Categories
            </Link>
            <Link to="/expenses" className="hover:underline">
              Expenses
            </Link>
            <Link to="/summary" className="hover:underline">
              Summary
            </Link>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-800">
            Dashboard
          </Link>
          <Link to="/categories" className="block px-4 py-2 hover:bg-blue-800">
            Categories
          </Link>
          <Link to="/expenses" className="block px-4 py-2 hover:bg-blue-800">
            Expenses
          </Link>
          <Link to="/summary" className="block px-4 py-2 hover:bg-blue-800">
            Summary
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-700 text-white"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;