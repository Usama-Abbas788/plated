import { Eye } from 'lucide-react'

import Badge from '../../atoms/Badge/Badge'
import Button from '../../atoms/Button/Button'
import IconButton from '../../atoms/IconButton/IconButton'

import DataTable from '../DataTable/DataTable'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '../Pagination/Pagination'

const statusVariants = {
  Pending: 'warning',
  Processing: 'info',
  Completed: 'success',
  Cancelled: 'danger',
}

const paymentVariants = {
  Paid: 'success',
  Unpaid: 'warning',
  Refunded: 'neutral',
}

const OrdersManagement = ({
  orders = [],

  searchValue = '',
  filterValues = {},
  sortValue = '',

  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,

  loading = false,
  canManage = true,

  onSearchChange,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onPageChange,

  onViewOrder,
  onUpdateStatus,
}) => {
  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      cellClassName: 'font-semibold',
    },
    {
      key: 'customer',
      label: 'Customer',
    },
    {
      key: 'date',
      label: 'Order Date',
    },
    {
      key: 'items',
      label: 'Items',
      render: (order) => Array.isArray(order.items)
        ? order.items.reduce((total, item) => total + Number(item.quantity || 0), 0)
        : order.itemCount ?? Number(order.items || 0),
    },
    {
      key: 'total',
      label: 'Total',
      render: (order) => `PKR ${Number(order.total).toLocaleString()}`,
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (order) => (
        <Badge variant={paymentVariants[order.paymentStatus] || 'neutral'}>
          {order.paymentStatus}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Order Status',
      render: (order) => (
        <Badge variant={statusVariants[order.status] || 'neutral'}>
          {order.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="flex items-center gap-2">
          <IconButton
            icon={Eye}
            label="View order"
            onClick={() => onViewOrder?.(order)}
          />

          {canManage && (
            <select
              aria-label={`Update status for order ${order.id}`}
              value={order.status}
              onChange={(event) =>
                onUpdateStatus?.(order.id, event.target.value)
              }
              className="plated-select h-9 rounded-xl border border-orange-100 bg-white px-2 text-xs text-text-primary outline-none focus:border-orange-600"
            >
              {Object.keys(statusVariants).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          )}
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
            Orders
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            View and manage all restaurant orders.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => onResetFilters?.()}
        >
          Reset Filters
        </Button>
      </div>

      {/* Search and Filters */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search by order ID or customer..."
        filters={[
          {
            key: 'status',
            label: 'All Order Statuses',
            options: Object.keys(statusVariants).map((status) => ({
              label: status,
              value: status,
            })),
          },
          {
            key: 'paymentStatus',
            label: 'All Payment Statuses',
            options: Object.keys(paymentVariants).map((status) => ({
              label: status,
              value: status,
            })),
          },
        ]}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        sortOptions={[
          { label: 'Newest First', value: 'date-desc' },
          { label: 'Oldest First', value: 'date-asc' },
          { label: 'Highest Amount', value: 'total-desc' },
          { label: 'Lowest Amount', value: 'total-asc' },
        ]}
        sortValue={sortValue}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyMessage="No orders found."
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

export default OrdersManagement
