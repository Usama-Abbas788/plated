import { Plus, Pencil, Trash2 } from 'lucide-react'

import Badge from '../../atoms/Badge/Badge'
import Button from '../../atoms/Button/Button'
import IconButton from '../../atoms/IconButton/IconButton'

import DataTable from '../DataTable/DataTable'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '../Pagination/Pagination'

const CategoriesManagement = ({
  categories = [],

  searchValue = '',
  filterValues = {},
  sortValue = '',

  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,

  loading = false,

  onSearchChange,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onPageChange,

  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      cellClassName: 'font-medium',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'productCount',
      label: 'Products',
      render: (category) => category.productCount ?? 0,
    },
    {
      key: 'status',
      label: 'Status',
      render: (category) => (
        <Badge
          variant={
            category.status === 'Active'
              ? 'success'
              : 'neutral'
          }
        >
          {category.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (category) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={Pencil}
            label="Edit category"
            onClick={() => onEditCategory?.(category)}
          />

          <IconButton
            icon={Trash2}
            label={category.productCount > 0 ? 'Cannot delete category with products' : 'Delete category'}
            variant="danger"
            disabled={category.productCount > 0}
            onClick={() => onDeleteCategory?.(category)}
          />
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-5">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Categories
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Organize and manage your restaurant menu categories.
          </p>
        </div>

        <Button onClick={onAddCategory}>
          <Plus size={18} />
          Add Category
        </Button>
      </div>

      {/* Search and Filters */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search categories..."
        filters={[
          {
            key: 'status',
            label: 'All Statuses',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ],
          },
        ]}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        sortOptions={[
          { label: 'Name: A to Z', value: 'name-asc' },
          { label: 'Name: Z to A', value: 'name-desc' },
          { label: 'Most Products', value: 'productCount-desc' },
          { label: 'Fewest Products', value: 'productCount-asc' },
        ]}
        sortValue={sortValue}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Categories Table */}
      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories found."
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

export default CategoriesManagement