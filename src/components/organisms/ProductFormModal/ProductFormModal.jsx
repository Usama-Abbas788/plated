import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

const getDefaultSizeNames = (productType) =>
  productType === "Drink" ? ["0.5 L", "1 L", "1.5 L"] : ["Small", "Medium", "Large"];

const getInitialFormData = (product, categories) => {
  const productType =
    product?.productType ||
    (categories.find((category) => String(category.id) === String(product?.categoryId))?.name === "Drinks"
      ? "Drink"
      : "Food");
  const sizes = product?.sizes?.length
    ? product.sizes.map((size) => ({ ...size, price: String(size.price ?? "") }))
    : getDefaultSizeNames(productType).map((name, index) => ({
        id: `${productType.toLowerCase()}-${index + 1}`,
        name,
        price: index === 0 && product?.price != null ? String(product.price) : "",
      }));

  return {
    name: product?.name || "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    productType,
    ingredients: (product?.ingredients || []).join("\n"),
    sizes,
    stock: product?.stock ?? "",
    status: product?.status || "Available",
  };
};

function ProductFormModal({
  isOpen,
  product,
  categories = [],
  products = [],
  error,
  onClose,
  onSubmit,
}) {
  // Initialize form state directly from props.
  // No effect is needed to reset the form.
  const [formData, setFormData] = useState(() =>
    getInitialFormData(product, categories),
  );

  const [errors, setErrors] = useState({});

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100";

  const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      ...(name === "productType"
        ? {
            productType: value,
            sizes: getDefaultSizeNames(value).map((sizeName, index) => ({
              id: `${value.toLowerCase()}-${index + 1}`,
              name: sizeName,
              price: "",
            })),
          }
        : {}),
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSizeChange = (index, field, value) => {
    setFormData((previous) => ({
      ...previous,
      sizes: previous.sizes.map((size, sizeIndex) =>
        sizeIndex === index ? { ...size, [field]: value } : size,
      ),
    }));
    setErrors((previous) => ({ ...previous, sizes: "" }));
  };

  const addSize = () => {
    setFormData((previous) => ({
      ...previous,
      sizes: [...previous.sizes, { id: `size-${Date.now()}`, name: "", price: "" }],
    }));
    setErrors((previous) => ({ ...previous, sizes: "" }));
  };

  const removeSize = (index) => {
    setFormData((previous) => ({
      ...previous,
      sizes: previous.sizes.filter((_, sizeIndex) => sizeIndex !== index),
    }));
    setErrors((previous) => ({ ...previous, sizes: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required.";
    }

    if (
      products.some(
        (item) =>
          item.id !== product?.id &&
          String(item.categoryId) === String(formData.categoryId) &&
          item.name.trim().toLowerCase() === formData.name.trim().toLowerCase(),
      )
    ) {
      newErrors.name = "A product with this name already exists in the selected category.";
    }

    if (!formData.categoryId) {
      newErrors.category = "Please select a category.";
    } else if (
      !categories.some(
        (category) =>
          String(category.id) === String(formData.categoryId) &&
          (category.status === "Active" ||
            String(category.id) === String(product?.categoryId)),
      )
    ) {
      newErrors.category = "Select an active category.";
    }

    if (!formData.sizes.length) {
      newErrors.sizes = "Add at least one size option.";
    } else {
      const sizeNames = formData.sizes.map((size) => size.name.trim().toLowerCase());
      if (sizeNames.some((name) => !name) || new Set(sizeNames).size !== sizeNames.length) {
        newErrors.sizes = "Enter a unique name for every size.";
      } else if (
        formData.sizes.some(
          (size) => size.price === "" || !Number.isFinite(Number(size.price)) || Number(size.price) <= 0,
        )
      ) {
        newErrors.sizes = "Enter a price greater than zero for every size.";
      }
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock = "Enter a valid stock quantity.";
    }

    if (!formData.status) {
      newErrors.status = "Please select a status.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      categoryId: Number(formData.categoryId),
      ingredients: formData.ingredients
        .split("\n")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean),
      sizes: formData.sizes.map((size) => ({
        ...size,
        name: size.name.trim(),
        price: Number(size.price),
      })),
      price: Math.min(...formData.sizes.map((size) => Number(size.price))),
      stock: Number(formData.stock),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-2 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="modal-scrollbar max-h-[calc(100dvh-1rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-4 sm:px-6">
          <div>
            <h2
              id="product-modal-title"
              className="text-lg font-semibold text-stone-900"
            >
              {product ? "Edit Product" : "Add New Product"}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {product
                ? "Update the product information below."
                : "Enter the details of your new product."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:p-6">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          {/* Product Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              Product Name
            </label>

            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Classic Burger"
              className={inputClass}
            />

            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>

            <select
              id="category"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={`${inputClass} plated-select`}
            >
              <option value="">Select category</option>

              {categories
                .filter(
                  (category) =>
                    category.status === "Active" ||
                    String(category.id) === String(product?.categoryId),
                )
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>

            {errors.category && (
              <p className="mt-1 text-xs text-red-600">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="productType" className={labelClass}>Product Type</label>
              <select
                id="productType"
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className={`${inputClass} plated-select`}
              >
                <option value="Food">Food</option>
                <option value="Drink">Drink</option>
              </select>
            </div>
            <div>
              <label htmlFor="stock" className={labelClass}>Stock Quantity</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="e.g. 50"
                className={inputClass}
              />
              {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="ingredients" className={labelClass}>Main Ingredients</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              placeholder={"Enter one ingredient per line"}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-stone-500">Customers will see these on the product detail page.</p>
          </div>

          <fieldset className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <legend className="text-sm font-medium text-stone-700">
                {formData.productType === "Drink" ? "Volume options and prices" : "Size options and prices"}
              </legend>
              <button
                type="button"
                onClick={addSize}
                className="inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                <Plus size={16} /> Add option
              </button>
            </div>
            {formData.sizes.map((size, index) => (
              <div key={size.id || index} className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto] items-end gap-2">
                <label className="min-w-0">
                  <span className={labelClass}>Option name</span>
                  <input
                    value={size.name}
                    onChange={(event) => handleSizeChange(index, "name", event.target.value)}
                    placeholder={formData.productType === "Drink" ? "e.g. 0.5 L" : "e.g. Small"}
                    className={inputClass}
                  />
                </label>
                <label className="min-w-0">
                  <span className={labelClass}>Price (PKR)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={size.price}
                    onChange={(event) => handleSizeChange(index, "price", event.target.value)}
                    placeholder="e.g. 1200"
                    className={inputClass}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  aria-label={`Remove size option ${index + 1}`}
                  className="mb-0.5 flex h-10 w-10 items-center justify-center rounded-lg text-stone-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
            {errors.sizes && <p className="text-xs text-red-600">{errors.sizes}</p>}
          </fieldset>

          {/* Status */}
          <div>
            <label htmlFor="status" className={labelClass}>
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputClass} plated-select`}
            >
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            {errors.status && (
              <p className="mt-1 text-xs text-red-600">{errors.status}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-stone-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-orange-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-800"
            >
              {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
