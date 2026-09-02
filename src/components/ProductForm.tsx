import { useState } from "react";
import type { Product } from "../types/Product";

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (product: Omit<Product, "id">) => void;
  onCancel: () => void;
}

export function ProductForm({
  initialProduct,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [count, setCount] = useState(String(initialProduct?.count ?? ""));
  const [width, setWidth] = useState(String(initialProduct?.size.width ?? ""));
  const [height, setHeight] = useState(
    String(initialProduct?.size.height ?? ""),
  );
  const [weight, setWeight] = useState(initialProduct?.weight ?? "");
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl ?? "");

  const isValid =
    name.trim() !== "" &&
    count.trim() !== "" &&
    width.trim() !== "" &&
    height.trim() !== "" &&
    weight.trim() !== "" &&
    imageUrl.trim() !== "";

  function handleSubmit() {
    if (!isValid) {
      return;
    }

    onSubmit({
      name: name.trim(),
      count: Number(count),
      size: {
        width: Number(width),
        height: Number(height),
      },
      weight: weight.trim(),
      imageUrl: imageUrl.trim(),
      comments: initialProduct?.comments ?? [],
    });
  }

  return (
    <div>
      <h2>{initialProduct ? "Edit product" : "Add product"}</h2>

      <div className="form-field">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Count</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Width</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Height</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label>Weight</label>
        <input value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>

      <div className="form-field">
        <label>Image URL</label>
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Confirm
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
