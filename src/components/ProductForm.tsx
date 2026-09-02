import { useState } from "react";
import type { Product } from "../types/Product";

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (product: Omit<Product, "id">) => void;
  onCancel: () => void;
}

interface FormErrors {
  name?: string;
  count?: string;
  width?: string;
  height?: string;
  weight?: string;
  imageUrl?: string;
}

const URL_PATTERN = /^https?:\/\/.+/i;
const WEIGHT_PATTERN = /^\d+(\.\d+)?\s*(g|kg)$/i;

export function ProductForm({
  initialProduct,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [count, setCount] = useState(String(initialProduct?.count ?? ""));
  const [currency, setCurrency] = useState<"USD" | "UAH">(
    initialProduct?.currency ?? "USD",
  );
  const [width, setWidth] = useState(String(initialProduct?.size.width ?? ""));
  const [height, setHeight] = useState(
    String(initialProduct?.size.height ?? ""),
  );
  const [weight, setWeight] = useState(initialProduct?.weight ?? "");
  const [imageUrl, setImageUrl] = useState(initialProduct?.imageUrl ?? "");

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    const trimmedName = name.trim();
    if (trimmedName === "") {
      nextErrors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    const countNum = Number(count);
    if (count.trim() === "") {
      nextErrors.count = "Count is required.";
    } else if (Number.isNaN(countNum)) {
      nextErrors.count = "Count must be a number.";
    } else if (countNum < 0) {
      nextErrors.count = "Count cannot be negative.";
    } else if (!Number.isInteger(countNum)) {
      nextErrors.count = "Count must be a whole number.";
    }

    const widthNum = Number(width);
    if (width.trim() === "") {
      nextErrors.width = "Width is required.";
    } else if (Number.isNaN(widthNum) || widthNum <= 0) {
      nextErrors.width = "Width must be a positive number.";
    }

    const heightNum = Number(height);
    if (height.trim() === "") {
      nextErrors.height = "Height is required.";
    } else if (Number.isNaN(heightNum) || heightNum <= 0) {
      nextErrors.height = "Height must be a positive number.";
    }

    const trimmedWeight = weight.trim();
    if (trimmedWeight === "") {
      nextErrors.weight = "Weight is required.";
    } else if (!WEIGHT_PATTERN.test(trimmedWeight)) {
      nextErrors.weight = 'Weight must look like "900g" or "1.5kg".';
    }

    const trimmedImageUrl = imageUrl.trim();
    if (trimmedImageUrl === "") {
      nextErrors.imageUrl = "Image URL is required.";
    } else if (!URL_PATTERN.test(trimmedImageUrl)) {
      nextErrors.imageUrl =
        "Enter a valid URL starting with http:// or https://.";
    }

    return nextErrors;
  }

  const liveErrors = validate();
  const isValid = Object.keys(liveErrors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate());
  }

  function handleSubmit() {
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      name: true,
      count: true,
      width: true,
      height: true,
      weight: true,
      imageUrl: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      name: name.trim(),
      count: Number(count),
      currency,
      size: {
        width: Number(width),
        height: Number(height),
      },
      weight: weight.trim(),
      imageUrl: imageUrl.trim(),
      comments: initialProduct?.comments ?? [],
    });
  }

  function showError(field: keyof FormErrors) {
    return touched[field] ? errors[field] : undefined;
  }

  return (
    <div>
      <h2>{initialProduct ? "Edit product" : "Add product"}</h2>

      <div className="form-field">
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {showError("name") && <p className="form-error">{showError("name")}</p>}
      </div>

      <div className="form-field">
        <label>Count</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          onBlur={() => handleBlur("count")}
        />
        {showError("count") && (
          <p className="form-error">{showError("count")}</p>
        )}
      </div>

      <div className="form-field">
        <label>Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as "USD" | "UAH")}
        >
          <option value="USD">USD ($)</option>
          <option value="UAH">UAH (₴)</option>
        </select>
      </div>

      <div className="form-field">
        <label>Width</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          onBlur={() => handleBlur("width")}
        />
        {showError("width") && (
          <p className="form-error">{showError("width")}</p>
        )}
      </div>

      <div className="form-field">
        <label>Height</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          onBlur={() => handleBlur("height")}
        />
        {showError("height") && (
          <p className="form-error">{showError("height")}</p>
        )}
      </div>

      <div className="form-field">
        <label>Weight</label>
        <input
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          onBlur={() => handleBlur("weight")}
          placeholder="e.g. 900g"
        />
        {showError("weight") && (
          <p className="form-error">{showError("weight")}</p>
        )}
      </div>

      <div className="form-field">
        <label>Image URL</label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onBlur={() => handleBlur("imageUrl")}
          placeholder="https://..."
        />
        {showError("imageUrl") && (
          <p className="form-error">{showError("imageUrl")}</p>
        )}
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
