import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(false);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="text-blue-600 hover:underline text-sm">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    window.dispatchEvent(new CustomEvent('mfe:add-to-cart', { detail: { product, quantity } }));
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg">
          ✓ Đã thêm vào giỏ hàng!
        </div>
      )}

      <Link to="/products" className="text-blue-600 hover:underline text-sm flex items-center gap-1 mb-6">
        ← Quay lại danh sách
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div
            className="md:w-96 h-72 md:h-auto flex items-center justify-center text-white"
            style={{ backgroundColor: product.color }}
          >
            <span className="text-8xl font-bold opacity-40">{product.name.charAt(0)}</span>
          </div>

          <div className="flex-1 p-8">
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
              <span className="text-gray-500 text-sm">{product.rating}/5</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                    -{discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center gap-2 mb-6">
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-gray-800 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
                >
                  🛒 Thêm vào giỏ hàng
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
