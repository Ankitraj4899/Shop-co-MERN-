const AdminCategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingCategoryId,
  categoryForm,
  onInputChange,
  formErrors = {},
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingCategoryId ? "Edit Category" : "Add New Category"}</h2>
          <button type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={onSubmit} noValidate>
          <label>
            Category Name
            <input
              name="name"
              value={categoryForm.name}
              onChange={onInputChange}
              placeholder="e.g. Jackets & Outerwear"
              className={formErrors.name ? "input--error" : ""}
            />
            {formErrors.name && (
              <span className="field-error-text">{formErrors.name}</span>
            )}
          </label>

          <label>
            Category Description
            <textarea
              name="description"
              rows="3"
              value={categoryForm.description}
              onChange={onInputChange}
              placeholder="Describe items in this category..."
              className={formErrors.description ? "input--error" : ""}
            />
            {formErrors.description && (
              <span className="field-error-text">{formErrors.description}</span>
            )}
          </label>

          <div className="modal-actions-row">
            <button
              type="button"
              className="button button--outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="button button--dark">
              {editingCategoryId ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryModal;
