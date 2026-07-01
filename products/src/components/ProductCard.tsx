import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))}
    <span className="text-gray-500 text-xs ml-1">({rating})</span>
  </div>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden flex flex-col">
    <Link to={`/products/${product.id}`}>
      <div
        className="h-48 flex items-center justify-center text-white text-4xl font-bold"
        style={{ backgroundColor: product.color }}
      >
        {product.name.charAt(0)}
      </div>
    </Link>
    <div className="p-4 flex flex-col flex-1">
      <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full self-start mb-2">
        {product.category}
      </span>
      <Link to={`/products/${product.id}`}>
        <h3 className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>
      </Link>
      <StarRating rating={product.rating} />
      <div className="mt-2 mb-3">
        <span className="text-lg font-bold text-blue-600">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through ml-2">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>
      <div className="mt-auto">
        {product.stock > 0 ? (
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Thêm vào giỏ
          </button>
        ) : (
          <button disabled className="w-full bg-gray-200 text-gray-400 text-sm py-2 px-4 rounded-lg cursor-not-allowed">
            Hết hàng
          </button>
        )}
      </div>
    </div>
  </div>
);

export default ProductCard;
