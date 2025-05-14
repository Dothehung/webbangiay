import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) return navigate('/');
    fetch(`http://localhost:3001/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await fetch('http://localhost:3001/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        }),
      });
      alert('Đã thêm vào giỏ hàng!');
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Không thể thêm vào giỏ hàng!');
    }
  };

  if (!product) return <p className="p-6">Đang tải sản phẩm...</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex justify-center items-start">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl w-full flex flex-col md:flex-row gap-8">
        {/* Ảnh sản phẩm */}
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[400px] object-contain rounded"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

          <p className="mb-2 line-through text-gray-400">4.600.000₫</p>

          <p className="text-2xl font-bold text-red-600 mb-2">
            {product.price.toLocaleString()}₫{' '}
            <span className="text-sm bg-red-500 text-white px-2 py-1 rounded ml-2">
              Tiết kiệm 15%
            </span>
          </p>

          <div className="bg-yellow-300 text-black px-4 py-2 rounded text-sm font-bold mb-4">
            FLASH SALE ⏰ 00 : 00 : 00
          </div>

          <div className="mb-4">
            <p className="mb-1 font-semibold">Size</p>
            <div className="flex gap-2">
              {['40', '41', '42', '43', '44'].map(size => (
                <button
                  key={size}
                  className="border px-3 py-1 rounded hover:bg-orange-100"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-1 font-semibold">Số lượng</p>
            <input
              type="number"
              min="1"
              defaultValue={1}
              className="w-20 border px-2 py-1 rounded"
              disabled
            />
          </div>

          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded"
            >
              THÊM VÀO GIỎ
            </button>
            <button className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 rounded">
              TƯ VẤN
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Sản phẩm được giao hàng toàn quốc. Đổi trả miễn phí trong 7 ngày.
          </p>
        </div>
      </div>
    </div>
  );
}
