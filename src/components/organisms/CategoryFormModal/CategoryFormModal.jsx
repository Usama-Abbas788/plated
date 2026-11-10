
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../atoms/Button/Button";
import Input from "../../atoms/Input/Input";
import Label from "../../atoms/Label/Label";

const getInitialFormData = (category) => ({
  name: category?.name || "",
  description: category?.description || "",
  status: category?.status || "Active",
});

const CategoryFormModal = ({
  isOpen,
  category,
  categories = [],
  error,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(category)
  );

  const [errors, setErrors] = useState({});

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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (
      categories.some(
        (item) =>
          String(item.id) !== String(category?.id) &&
          item.name.trim().toLowerCase() === formData.name.trim().toLowerCase(),
      )
    ) {
      newErrors.name = "A category with this name already exists";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.status) {
      newErrors.status = "Please select a status";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-2 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        className="modal-scrollbar max-h-[calc(100dvh-1rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl sm:max-h-[calc(100dvh-2rem)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-4 sm:px-6">
          <div>
            <h2 id="category-modal-title" className="text-xl font-semibold text-stone-900">
              {category ? "Edit Category" : "Add Category"}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              {category
                ? "Update category information"
                : "Create a new product category"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            aria-label="Close modal"
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
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Burgers"
            />
            {errors.name && <p className="text-xs text-status-danger">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-description">Description</Label>
            <textarea
              id="category-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter category description"
              rows={3}
              className="w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none transition focus:border-orange-700 focus:ring-2 focus:ring-orange-100"
            />
            {errors.description && <p className="text-xs text-status-danger">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-status">Status</Label>
            <select
              id="category-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="plated-select w-full rounded-xl border border-orange-100 bg-white px-3 py-2 text-sm outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <p className="text-xs text-status-danger">{errors.status}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-stone-200 pt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button type="submit">
              {category ? "Save Changes" : "Add Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
