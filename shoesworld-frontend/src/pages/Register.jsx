import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      console.log('Phản hồi từ backend:', data);
      if (!res.ok) throw new Error('Đăng ký thất bại');
      const user = data.user || data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('cart', '[]');
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Email đã tồn tại hoặc có lỗi xảy ra!');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm"
      >
        <h2 className="text-xl font-bold text-orange-500 mb-4 text-center">
          Đăng ký ShoesWorld
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Tên người dùng"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
        >
          Đăng ký
        </button>
        <p className="text-sm text-center mt-4">
          Đã có tài khoản?{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate('/')}
          >
            Đăng nhập
          </span>
        </p>
      </form>
    </div>
  );
}