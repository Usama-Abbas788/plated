import { useEffect, useState } from "react";

import OwnerDashboardTemplate from "../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate";

import ProductsManagement from "../../../components/organisms/ProductsManagement/ProductsManagement";

import ProductFormModal from "../../../components/organisms/ProductFormModal/ProductFormModal";
import ConfirmActionModal from "../../../components/organisms/ConfirmActionModal/ConfirmActionModal";
import useProductStore from "../../../stores/domain/productStore";
import useCategoryStore from "../../../stores/domain/categoryStore";
import useHasPermission from "../../../auth/useHasPermission";

const Products = () => {
  const canManageProducts = useHasPermission('products.manage')
  const products = useProductStore((state) => state.products);
  const loadProducts = useProductStore((state) => state.load);
  const productsLoading = useProductStore((state) => state.isLoading);
  const productsLoaded = useProductStore((state) => state.hasLoaded);
  const productsError = useProductStore((state) => state.error);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const categories = useCategoryStore((state) => state.categories);
  const loadCategories = useCategoryStore((state) => state.load);
  const categoriesLoading = useCategoryStore((state) => state.isLoading);
  const categoriesLoaded = useCategoryStore((state) => state.hasLoaded);
  const categoriesError = useCategoryStore((state) => state.error);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadCategories, loadProducts]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Search, filter and sorting states
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [sortValue, setSortValue] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  // Open modal for adding a product
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Open modal for editing a product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Save new or updated product
  const handleSaveProduct = async (formData) => {
    let savedProduct;
    if (selectedProduct) {
      savedProduct = await updateProduct(selectedProduct.id, formData);
    } else {
      savedProduct = await addProduct(formData);
    }

    if (!savedProduct) return;
    if (!selectedProduct) setCurrentPage(1);
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Delete product
  const handleDeleteProduct = async () => {
    const deleted = await deleteProduct(productToDelete.id);
    if (deleted) setProductToDelete(null);
    return deleted || useProductStore.getState().error || false;
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  // Handle filters
  const handleFilterChange = (key, value) => {
    setFilterValues((previous) => ({
      ...previous,
      [key]: value,
    }));

    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setFilterValues({});
    setSortValue("");
    setCurrentPage(1);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      (categories.find((category) => String(category.id) === String(product.categoryId))?.name || "")
        .toLowerCase()
        .includes(searchTerm);

    const matchesCategory =
      !filterValues.category ||
      String(product.categoryId) === String(filterValues.category);

    const matchesStatus =
      !filterValues.status ||
      product.status === filterValues.status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortValue) {
      case "name-asc":
        return a.name.localeCompare(b.name);

      case "name-desc":
        return b.name.localeCompare(a.name);

      case "price-asc":
        return a.price - b.price;

      case "price-desc":
        return b.price - a.price;

      default:
        return 0;
    }
  });

  // Pagination
  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Keep current page valid when products are deleted or filtered
  const validPage = Math.min(currentPage, totalPages);

  const paginatedProducts = sortedProducts.slice(
    (validPage - 1) * pageSize,
    validPage * pageSize
  );
  const productsWithCategoryName = paginatedProducts.map((product) => ({
    ...product,
    categoryName: categories.find((category) => String(category.id) === String(product.categoryId))?.name,
  }));
  const activeCategories = categories.filter((category) => category.status === "Active");

  return (
    <OwnerDashboardTemplate
      title="Products"
      subtitle="Manage your restaurant menu and products."
      error={productsError || categoriesError}
      loading={productsLoading || categoriesLoading || !productsLoaded || !categoriesLoaded}
      onRetry={() => {
        loadProducts();
        loadCategories();
      }}
    >
      <ProductsManagement
        products={productsWithCategoryName}
        categories={categories}
        loading={productsLoading || !productsLoaded}
        canManage={canManageProducts}
        canAddProduct={activeCategories.length > 0}
        searchValue={search}
        filterValues={filterValues}
        sortValue={sortValue}
        currentPage={validPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={(value) => {
          setSortValue(value);
          setCurrentPage(1);
        }}
        onResetFilters={handleResetFilters}
        onPageChange={setCurrentPage}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={setProductToDelete}
      />

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <ProductFormModal
          key={selectedProduct?.id ?? "new-product"}
          isOpen={isModalOpen}
          product={selectedProduct}
          categories={categories}
          products={products}
          error={productsError}
          onClose={handleCloseModal}
          onSubmit={handleSaveProduct}
        />
      )}
      {productToDelete && (
        <ConfirmActionModal
          title="Delete product?"
          message={`"${productToDelete.name}" will be removed from the menu. This action cannot be undone.`}
          confirmLabel="Delete product"
          error={productsError}
          onClose={() => setProductToDelete(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </OwnerDashboardTemplate>
  );
};

export default Products;