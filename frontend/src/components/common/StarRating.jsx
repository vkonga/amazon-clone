import React from 'react';
import { FiStar } from 'react-icons/fi';
import { getStars } from '../../utils/helpers';

const StarRating = ({ rating = 0, count = null, size = 16 }) => {
  const { full, half, empty } = getStars(rating);

  return (
    <span className="stars" aria-label={`Rating: ${rating} out of 5`}>
      {Array(full).fill(null).map((_, i) => (
        <FiStar key={`f${i}`} size={size} fill="currentColor" />
      ))}
      {half === 1 && (
        <span style={{ position: 'relative', display: 'inline-block', width: size }}>
          <FiStar size={size} style={{ position: 'absolute' }} />
          <span style={{
            position: 'absolute', overflow: 'hidden', width: '50%',
            display: 'inline-block', color: 'var(--color-rating)'
          }}>
            <FiStar size={size} fill="currentColor" />
          </span>
        </span>
      )}
      {Array(empty).fill(null).map((_, i) => (
        <FiStar key={`e${i}`} size={size} style={{ opacity: 0.3 }} />
      ))}
      {count !== null && (
        <span style={{ fontSize: 12, color: 'var(--text-link)', marginLeft: 4 }}>
          ({count})
        </span>
      )}
    </span>
  );
};

export default StarRating;
