import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import logo from '../images/ticketscoutlogo.png';
import SearchBar from './SearchBar';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Ticket Scout Logo" className="h-16" />
        </Link>
        {!isHome && (
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}
        <div className="flex items-center space-x-6">
          <Link 
            to="/how-it-works" 
            className="text-gray-600 hover:text-gray-900 transition"
          >
            How It Works
          </Link>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;