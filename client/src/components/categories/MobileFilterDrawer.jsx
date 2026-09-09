const MobileFilterDrawer = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="mobile-filter-overlay" onClick={onClose}>
      <div className="mobile-filter-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-drawer__header">
          <h2 className="mobile-drawer__title">Filters</h2>
          <button
            type="button"
            className="close-drawer-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MobileFilterDrawer;
