import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { updateProduct } from "../store/productsSlice";
import {
  fetchComments,
  addComment,
  deleteComment,
} from "../store/commentsSlice";
import type { Product } from "../types/Product";
import { Modal } from "../components/Modal";
import { ProductForm } from "../components/ProductForm";

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  const product = useSelector((state: RootState) =>
    state.products.items.find((p) => String(p.id) === id),
  );

  const comments = useSelector((state: RootState) =>
    state.comments.items.filter((c) => String(c.productId) === id),
  );

  useEffect(() => {
    dispatch(fetchComments());
  }, [dispatch]);

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
        className="btn btn-primary"
        onClick={() => setIsEditModalOpen(true)}
      >
        Edit
      </button>

      <h2>Comments</h2>
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <span>
              {comment.description} <small>({comment.date})</small>
            </span>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => dispatch(deleteComment(comment.id))}
            >
              Delete
            </button>
          </li>
        ))}
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
