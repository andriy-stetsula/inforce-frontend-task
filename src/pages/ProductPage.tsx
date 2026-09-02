import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { updateProduct } from "../store/productsSlice";
import {
  fetchComments,
  addComment,
  deleteComment,
  updateComment,
} from "../store/commentsSlice";
import type { Product } from "../types/Product";
import { Modal } from "../components/Modal";
import { ProductForm } from "../components/ProductForm";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const product = useSelector((state: RootState) =>
    state.products.items.find((p) => p.id === id),
  );

  const productsLoading = useSelector(
    (state: RootState) => state.products.loading,
  );

  const comments = useSelector((state: RootState) =>
    state.comments.items.filter((c) => c.productId === id),
  );

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

  if (!product && productsLoading) {
    return <p className="page">Loading product...</p>;
  }

  if (!product) {
    return (
      <p className="page">
        Product not found.{" "}
        <Link className="back-link" to="/">
          Back to list
        </Link>
      </p>
    );
  }

  function handleUpdate(updated: Omit<Product, "id">) {
    dispatch(updateProduct({ ...updated, id: product!.id }));
    setIsEditModalOpen(false);
  }

  function handleAddComment() {
    if (newCommentText.trim() === "") {
      return;
    }

    dispatch(
      addComment({
        productId: product!.id,
        description: newCommentText.trim(),
        date: new Date().toLocaleString(),
      }),
    );
    setNewCommentText("");
  }

  function handleStartEditComment(commentId: string, currentText: string) {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  }

  function handleCancelEditComment() {
    setEditingCommentId(null);
    setEditingCommentText("");
  }

  function handleSaveEditComment() {
    const trimmed = editingCommentText.trim();
    const original = comments.find((c) => c.id === editingCommentId);
    if (trimmed === "" || !original) {
      return;
    }

    dispatch(updateComment({ ...original, description: trimmed }));
    setEditingCommentId(null);
    setEditingCommentText("");
  }

  return (
    <div className="page product-detail">
      <Link className="back-link" to="/">
        ← Back to list
      </Link>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} />
      <p>Count: {product.count}</p>
      <p>Weight: {product.weight}</p>
      <p>
        Size: {product.size.width}x{product.size.height}
      </p>

      <button
        type="button"
        className="btn btn-primary btn-button"
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit
      </button>

      <h2>Comments</h2>
      <ul className="comment-list">
        {comments.map((comment) =>
          editingCommentId === comment.id ? (
            <li key={comment.id} className="comment-item comment-item--editing">
              <input
                className="comment-edit-input"
                value={editingCommentText}
                onChange={(e) => setEditingCommentText(e.target.value)}
                autoFocus
              />
              <div className="comment-edit-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveEditComment}
                  disabled={editingCommentText.trim() === ""}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelEditComment}
                >
                  Cancel
                </button>
              </div>
            </li>
          ) : (
            <li key={comment.id} className="comment-item">
              <span>
                {comment.description} <small>({comment.date})</small>
              </span>
              <div className="comment-item-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    handleStartEditComment(comment.id, comment.description)
                  }
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => dispatch(deleteComment(comment.id))}
                >
                  Delete
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      <div className="comment-form">
        <input
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Add a comment"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddComment}
        >
          Add
        </button>
      </div>

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <ProductForm
            initialProduct={product}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
