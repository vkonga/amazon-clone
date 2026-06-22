import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cart/cartSlice';
import { formatPrice } from '../../utils/helpers';
import StarRating from './StarRating';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://placehold.co/300x300/f8f8f8/ccc?text=Product';

const ProductCard = ({ product }) => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({
      productId: product._id,
      name:      product.name,
      price:     product.price,
      image:     product.images?.[0] || PLACEHOLDER,
      quantity:  1
    }));
    toast.success(`${product.name.slice(0, 20)}... added to cart!`);
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/products/${product._id}`)}
      role="button"
      aria-label={`View ${product.name}`}
    >
      <img
        className="product-card__image"
        src={product.images?.[0] || PLACEHOLDER}
        alt={product.name}
        loading="lazy"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />
      <div className="product-card__body">
        <p className="product-card__name">{product.name}</p>

        <StarRating rating={product.rating} count={product.numReviews} size={14} />

        <p className="product-card__price" style={{ marginTop: 6 }}>
          <span className="product-card__price-currency">$</span>
          {parseFloat(product.price).toFixed(2)}
        </p>

        {product.stock === 0 ? (
          <p style={{ color: 'var(--color-error)', fontSize: 12, marginTop: 4 }}>Out of Stock</p>
        ) : (
          <button
            id={`add-to-cart-${product._id}`}
            className="btn btn-primary btn-full"
            style={{ marginTop: 10 }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
