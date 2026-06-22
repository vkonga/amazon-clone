import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 7;
  let start = Math.max(1, currentPage - 3);
  let end   = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination" aria-label="Pagination">
      <button
        id="pagination-prev"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹ Prev
      </button>

      {start > 1 && (
        <>
          <button className="pagination__btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          id={`pagination-page-${p}`}
          className={`pagination__btn ${p === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
          aria-label={`Page ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>…</span>}
          <button className="pagination__btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        id="pagination-next"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next ›
      </button>
    </div>
  );
};

export default Pagination;
