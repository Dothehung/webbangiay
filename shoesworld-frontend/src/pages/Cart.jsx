import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return navigate('/');
    fetch(`http://localhost:3001/cart/${user.id}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => {
        console.error(err);
        setError('Không thể tải giỏ hàng.');
      });
  }, []);

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await fetch('http://localhost:3001/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity }),
      });
      setItems(items.map(item => (item.id === id ? { ...item, quantity } : item)));
    } catch (err) {
      console.error(err);
      setError('Không thể cập nhật số lượng.');
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`http://localhost:3001/cart/${id}`, { method: 'DELETE' });
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      setError('Không thể xoá sản phẩm.');
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-2xl font-bold text-orange-500 mb-6">🛒 GIỎ HÀNG CỦA BẠN</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Giỏ hàng */}
        <div className="md:col-span-2 space-y-4">
          {items.length === 0 ? (
            <p className="text-gray-600">Giỏ hàng trống.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-white p-4 rounded shadow flex gap-4 items-center">
                <img
                    src={item.image?.startsWith('/') ? item.image : `/images/product1.jpg`}
                    onError={(e) => (e.target.src = '/images/product1.jpg')}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded border"
                  />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">SKU: {item.id}</p>
                  <p className="text-orange-500 font-bold mt-1">
                    Giá: {item.price.toLocaleString()}₫
                  </p>
                  <div className="flex items-center mt-2 gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-12 text-center border rounded"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Thông tin đơn hàng */}
        <div className="bg-white p-4 rounded shadow h-fit">
          <h3 className="text-lg font-bold text-blue-700 mb-4">THÔNG TIN ĐƠN HÀNG</h3>
          <p className="mb-2">Tổng cộng: <span className="text-orange-500 font-bold">{total.toLocaleString()}₫</span></p>
          <input
            type="text"
            placeholder="Nhập họ tên tại đây..."
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Nhập số điện thoại..."
            className="w-full mb-4 p-2 border rounded"
          />
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded">
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

