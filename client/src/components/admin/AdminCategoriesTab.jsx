const AdminCategoriesTab = ({
  categories,
  products,
  onOpenAddCategory,
  onOpenEditCategory,
  onDeleteCategory,
}) => {
  return (
    <section className="admin-section">
      <div className="admin-section-toolbar">
        <h2>Product Categories</h2>
        <button
          type="button"
          className="button button--dark button--add"
          onClick={onOpenAddCategory}
        >
          + Add New Category
        </button>
      </div>

      <div className="admin-table-scroll">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Description</th>
              <th>Assigned Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const assignedCount = products.filter(
                (p) => (p.category?._id || p.category) === cat._id
              ).length;
              return (
                <tr key={cat._id}>
                  <td>
                    <strong>{cat.name}</strong>
                  </td>
                  <td>{cat.description || "No description provided."}</td>
                  <td>
                    <span className="badge badge--neutral">
                      {assignedCount} items
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        type="button"
                        className="action-btn action-btn--edit"
                        onClick={() => onOpenEditCategory(cat)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn action-btn--delete"
                        onClick={() => onDeleteCategory(cat._id, cat.name)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminCategoriesTab;
