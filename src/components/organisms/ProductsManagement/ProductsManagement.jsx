import { PackagePlus, Pencil, Trash2 } from 'lucide-react'

import Badge from '../../atoms/Badge/Badge'
import Button from '../../atoms/Button/Button'
import IconButton from '../../atoms/IconButton/IconButton'

import DataTable from '../DataTable/DataTable'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '../Pagination/Pagination'

const ProductsManagement = ({
  products = [],
  categories = [],

  searchValue = '',
  filterValues = {},
  sortValue = '',

  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,

  loading = false,
  canManage = true,
  canAddProduct = true,

  onSearchChange,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onPageChange,

  onAddProduct,
  onEditProduct,
  onDeleteProduct,
}) => {
  // Category filter options
  const categoryOptions = categories.map((category) =>
    typeof category === 'string'
      ? { label: category, value: category }
    : { label: category.name, value: String(category.id) }
  )

  // Product table columns
  const columns = [
    {
      key: 'name',
      label: 'Product Name',
      cellClassName: 'font-medium',
    },
    {
      key: 'category',
      label: 'Category',
      render: (product) => product.categoryName || '—',
    },
    {
      key: 'price',
      label: 'Price',
      render: (product) => `From PKR ${Number(product.price).toLocaleString()}`,
    },
    {
      key: 'productType',
      label: 'Type',
      render: (product) => product.productType || 'Food',
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (product) => (
        <span
          className={
            product.stock <= 5
              ? 'font-medium text-status-danger'
              : 'text-text-primary'
          }
        >
          {product.stock}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (product) => (
        <Badge
          variant={
            product.status === 'Available'
              ? 'success'
              : 'danger'
          }
        >
          {product.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (product) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={Pencil}
            label="Edit product"
            onClick={() => onEditProduct?.(product)}
          />

          <IconButton
            icon={Trash2}
            label="Delete product"
            variant="danger"
            onClick={() => onDeleteProduct?.(product)}
          />
        </div>
      ),
    },
  ]
  const visibleColumns = canManage
    ? columns
    : columns.filter((column) => column.key !== 'actions')

  return (
    <section className="space-y-5">
      {/* Page Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Products
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Manage your restaurant menu and products.
          </p>
        </div>

        {canManage && (
          <Button onClick={onAddProduct} disabled={!canAddProduct}>
            <PackagePlus size={18} />
            Add Product
          </Button>
        )}
      </div>
      {canManage && !canAddProduct && (
        <p className="text-sm text-text-secondary" role="status">
          Create or activate a category before adding products.
        </p>
      )}

      {/* Search and Filters */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search products..."
        filters={[
          {
            key: 'category',
            label: 'All Categories',
            options: categoryOptions,
          },
          {
            key: 'status',
            label: 'All Statuses',
            options: [
              { label: 'Available', value: 'Available' },
              { label: 'Unavailable', value: 'Unavailable' },
            ],
          },
        ]}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        sortOptions={[
          { label: 'Name: A to Z', value: 'name-asc' },
          { label: 'Name: Z to A', value: 'name-desc' },
          { label: 'Price: Low to High', value: 'price-asc' },
          { label: 'Price: High to Low', value: 'price-desc' },
        ]}
        sortValue={sortValue}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Products Table */}
      <DataTable
        columns={visibleColumns}
        data={products}
        loading={loading}
        emptyMessage="No products found."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </section>
  )
}

export default ProductsManagement