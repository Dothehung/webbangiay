import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/');
  };

  return (
    <nav className="bg-orange-500 text-white px-6 py-4 shadow-md sticky top-0 z-50 flex justify-between items-center">
      <Link to="/home" className="text-2xl font-bold hover:underline">
        ShoesWorld
      </Link>
      {user && (
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative hover:underline">
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-white text-orange-500 rounded-full px-2 text-xs font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={handleLogout}
            className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-100 transition"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </nav>
  );
}
