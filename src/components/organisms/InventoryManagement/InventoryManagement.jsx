import { Plus, Pencil, Trash2 } from 'lucide-react'

import Badge from '../../atoms/Badge/Badge'
import Button from '../../atoms/Button/Button'
import IconButton from '../../atoms/IconButton/IconButton'

import DataTable from '../DataTable/DataTable'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '../Pagination/Pagination'

const getStockStatus = (item) => {
  if (item.quantity <= 0) {
    return {
      label: 'Out of Stock',
      variant: 'danger',
    }
  }

  if (item.quantity <= item.minimumStock) {
    return {
      label: 'Low Stock',
      variant: 'warning',
    }
  }

  return {
    label: 'In Stock',
    variant: 'success',
  }
}

const InventoryManagement = ({
  inventory = [],

  searchValue = '',
  filterValues = {},
  sortValue = '',

  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,

  loading = false,
  canManage = true,
  categories = [],

  onSearchChange,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onPageChange,

  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Item Name',
      cellClassName: 'font-medium',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'quantity',
      label: 'Available Stock',
      render: (item) => `${item.quantity} ${item.unit}`,
    },
    {
      key: 'minimumStock',
      label: 'Minimum Stock',
      render: (item) => `${item.minimumStock} ${item.unit}`,
    },
    {
      key: 'cost',
      label: 'Unit Cost',
      render: (item) => `PKR ${Number(item.cost).toLocaleString()}`,
    },
    {
      key: 'stockStatus',
      label: 'Stock Status',
      render: (item) => {
        const status = getStockStatus(item)

        return (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={Pencil}
            label="Edit inventory item"
            onClick={() => onEditItem?.(item)}
          />

          <IconButton
            icon={Trash2}
            label="Delete inventory item"
            variant="danger"
            onClick={() => onDeleteItem?.(item)}
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
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Inventory
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Monitor ingredients and manage your restaurant stock.
          </p>
        </div>

        {canManage && (
          <Button onClick={onAddItem}>
            <Plus size={18} />
            Add Inventory Item
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search inventory..."
        filters={[
          {
            key: 'category',
            label: 'All Categories',
            options: categories.map((category) => ({
              label: category,
              value: category,
            })),
          },
          {
            key: 'stockStatus',
            label: 'All Stock Levels',
            options: [
              { label: 'In Stock', value: 'In Stock' },
              { label: 'Low Stock', value: 'Low Stock' },
              { label: 'Out of Stock', value: 'Out of Stock' },
            ],
          },
        ]}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        sortOptions={[
          { label: 'Name: A to Z', value: 'name-asc' },
          { label: 'Name: Z to A', value: 'name-desc' },
          { label: 'Quantity: Low to High', value: 'quantity-asc' },
          { label: 'Quantity: High to Low', value: 'quantity-desc' },
        ]}
        sortValue={sortValue}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Inventory Table */}
      <DataTable
        columns={visibleColumns}
        data={inventory}
        loading={loading}
        emptyMessage="No inventory items found."
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

export default InventoryManagement