import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchProducts,
  createProduct,
  deleteProduct,
} from "../store/productsSlice";
import type { Product } from "../types/Product";
import { Modal } from "../components/Modal";
import { ProductForm } from "../components/ProductForm";

type SortType = "default" | "name" | "count";

function sortProducts(products: Product[], sortType: SortType): Product[] {
  const copy = [...products];

  if (sortType === "name") {
    return copy.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortType === "count") {
    return copy.sort((a, b) => a.count - b.count);
  }

  return copy.sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name);
    if (nameCompare !== 0) {
      return nameCompare;
    }
    return a.count - b.count;
  });
}

export function ProductsListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.products,
  );
  const [sortType, setSortType] = useState<SortType>("default");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  function handleAddProduct(newProduct: Omit<Product, "id">) {
    dispatch(createProduct(newProduct));
    setIsAddModalOpen(false);
  }

  function handleConfirmDelete() {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete.id));
      setProductToDelete(null);
    }
  }

  if (loading) {
    return <p className="page">Loading products...</p>;
  }

  if (error) {
    return <p className="page">Error: {error}</p>;
  }

  const visibleProducts = sortProducts(items, sortType);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Product List</h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add product
        </button>
      </div>

      <div className="controls-row">
        <div>
          <label htmlFor="sort">Sort by: </label>
          <select
            id="sort"
            className="sort-select"
            value={sortType}
            onChange={(event) => setSortType(event.target.value as SortType)}
          >
            <option value="default">Name, then count</option>
            <option value="name">Name</option>
            <option value="count">Count</option>
          </select>
        </div>
      </div>

      <ul className="product-list">
        {visibleProducts.map((product) => (
          <li key={product.id} className="product-list-item">
            <Link className="product-link" to={`/products/${product.id}`}>
              {product.name} — count: {product.count}
            </Link>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setProductToDelete(product)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <ProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </Modal>
      )}

      {productToDelete && (
        <Modal onClose={() => setProductToDelete(null)}>
          <div>
            <p>Are you sure you want to delete "{productToDelete.name}"?</p>
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
