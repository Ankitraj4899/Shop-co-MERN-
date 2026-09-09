import { useMemo } from "react";

const CategoryPagination = ({ pagination, page, setPage }) => {
  const pageButtons = useMemo(() => {
    const total = pagination.totalPages || 1;
    const current = pagination.page || 1;
    const buttons = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
        buttons.push(i);
      } else if (buttons[buttons.length - 1] !== "...") {
        buttons.push("...");
      }
    }
    return buttons;
  }, [pagination.totalPages, pagination.page]);

  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__nav-btn"
        disabled={!pagination.hasPrevious}
        onClick={() => {
          setPage((prev) => Math.max(1, prev - 1));
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        ← Previous
      </button>

      <div className="pagination__numbers">
        {pageButtons.map((btn, index) =>
          btn === "..." ? (
            <span key={`ellipsis-${index}`} className="pagination__dots">
              ...
            </span>
          ) : (
            <button
              key={`page-${btn}`}
              type="button"
              className={`pagination__num-btn ${
                pagination.page === btn ? "is-active" : ""
              }`}
              onClick={() => {
                setPage(btn);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {btn}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className="pagination__nav-btn"
        disabled={!pagination.hasNext}
        onClick={() => {
          setPage((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        Next →
      </button>
    </div>
  );
};

export default CategoryPagination;
