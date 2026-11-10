
import {
  Eye,
  CreditCard,
  Wallet,
  Banknote,
  RotateCcw,
} from 'lucide-react'

import Badge from '../../atoms/Badge/Badge'
import IconButton from '../../atoms/IconButton/IconButton'
import DataTable from '../DataTable/DataTable'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '../Pagination/Pagination'

const paymentStatusVariants = {
  Paid: 'success',
  Completed: 'success',
  Pending: 'warning',
  Failed: 'danger',
  Refunded: 'neutral',
}

const paymentMethodIcons = {
  Cash: Banknote,
  Card: CreditCard,
  Wallet: Wallet,
  Online: Wallet,
}

const PaymentsManagement = ({
  payments = [],

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

  onViewPayment,
  onRefundPayment,
}) => {
  const columns = [
    {
      key: 'transactionId',
      label: 'Transaction ID',
      render: (payment) => (
        <span className="font-medium text-text-primary">
          {payment.transactionId}
        </span>
      ),
    },

    {
      key: 'orderId',
      label: 'Order ID',
      render: (payment) => (
        <span className="text-sm text-text-secondary">
          {payment.orderId}
        </span>
      ),
    },

    {
      key: 'customer',
      label: 'Customer',
      render: (payment) => (
        <div>
          <p className="font-medium text-text-primary">
            {payment.customer}
          </p>
          <p className="text-xs text-text-secondary">
            {payment.email}
          </p>
        </div>
      ),
    },

    {
      key: 'method',
      label: 'Payment Method',
      render: (payment) => {
        const MethodIcon = paymentMethodIcons[payment.method] || CreditCard

        return (
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MethodIcon size={17} />
            {payment.method}
          </div>
        )
      },
    },

    {
      key: 'date',
      label: 'Date',
    },

    {
      key: 'amount',
      label: 'Amount',
      render: (payment) => (
        <span className="font-medium text-text-primary">
            PKR {Number(payment.amount).toLocaleString()}
        </span>
      ),
    },

    {
      key: 'status',
      label: 'Status',
      render: (payment) => (
        <Badge variant={paymentStatusVariants[payment.status] || 'neutral'}>
          {payment.status}
        </Badge>
      ),
    },

    {
      key: 'actions',
      label: 'Actions',
      render: (payment) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={Eye}
            label="View payment"
            onClick={() => onViewPayment?.(payment)}
          />

          {canManage && (payment.status === 'Paid' || payment.status === 'Completed') && (
            <IconButton
              icon={RotateCcw}
              label="Refund payment"
              variant="danger"
              onClick={() => onRefundPayment?.(payment)}
            />
          )}
        </div>
      ),
    },
  ]

  const filters = [
    {
      key: 'status',
      label: 'Payment Status',
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Completed', value: 'Completed' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Failed', value: 'Failed' },
        { label: 'Refunded', value: 'Refunded' },
      ],
    },
    {
      key: 'method',
      label: 'Payment Method',
      options: [
        { label: 'Cash', value: 'Cash' },
        { label: 'Card', value: 'Card' },
        { label: 'Wallet', value: 'Wallet' },
        { label: 'Online', value: 'Online' },
      ],
    },
  ]

  const sortOptions = [
    { label: 'Newest First', value: 'date-desc' },
    { label: 'Oldest First', value: 'date-asc' },
    { label: 'Highest Amount', value: 'amount-desc' },
    { label: 'Lowest Amount', value: 'amount-asc' },
  ]

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary">
          Payments Management
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          Monitor transactions, payment methods, and refunds.
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search transaction or customer..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        sortOptions={sortOptions}
        sortValue={sortValue}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Payments Table */}
      <DataTable
        columns={columns}
        data={payments}
        loading={loading}
        emptyMessage="No payment transactions found."
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

export default PaymentsManagement
