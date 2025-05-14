import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return navigate('/');
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-orange-500 text-center">
        Danh sách sản phẩm
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-2xl shadow hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
              <p className="text-orange-500 font-bold text-lg mb-3">
                {product.price.toLocaleString()}₫
              </p>
              <Link
                to={`/product/${product.id}`}
                className="inline-block text-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
