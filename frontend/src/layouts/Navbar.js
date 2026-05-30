import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-800 text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          ELITE97 STUDY SYSTEM
        </Link>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <span className="hidden md:block">Welcome, {user.name}!</span>
              <button
                onClick={logout}
                className="hover:text-blue-200 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                Login
              </Link>
              <Link to="/register" className="ml-4 hover:text-blue-200 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;