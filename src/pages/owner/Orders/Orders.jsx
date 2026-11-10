
import { useEffect, useState } from 'react'

import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import OrdersManagement from '../../../components/organisms/OrdersManagement/OrdersManagement'
import RecordDetailsModal from '../../../components/organisms/RecordDetailsModal/RecordDetailsModal'
import ConfirmActionModal from '../../../components/organisms/ConfirmActionModal/ConfirmActionModal'
import useOrderStore from '../../../stores/domain/orderStore'
import useHasPermission from '../../../auth/useHasPermission'

const Orders = () => {
  const canManageOrders = useHasPermission('orders.manage')
  const orders = useOrderStore((state) => state.orders)
  const loadOrders = useOrderStore((state) => state.load)
  const isLoading = useOrderStore((state) => state.isLoading)
  const hasLoaded = useOrderStore((state) => state.hasLoaded)
  const error = useOrderStore((state) => state.error)
  const updateOrder = useOrderStore((state) => state.updateOrder)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderToCancel, setOrderToCancel] = useState(null)

  const [search, setSearch] = useState('')
  const [filterValues, setFilterValues] = useState({})
  const [sortValue, setSortValue] = useState('')

  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 5

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const handleFilterChange = (key, value) => {
    setFilterValues((previous) => ({
      ...previous,
      [key]: value,
    }))

    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearch('')
    setFilterValues({})
    setSortValue('')
    setCurrentPage(1)
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    if (newStatus === 'Cancelled') {
      const order = orders.find((item) => item.id === orderId)
      if (order && order.status !== 'Cancelled') setOrderToCancel(order)
      return
    }

    const updatedOrder = await updateOrder(orderId, { status: newStatus })
    if (updatedOrder && selectedOrder?.id === orderId) {
      setSelectedOrder(updatedOrder)
    }
  }

  const handleConfirmCancellation = async () => {
    if (!orderToCancel) return 'The selected order is no longer available.'

    const updatedOrder = await updateOrder(orderToCancel.id, { status: 'Cancelled' })
    if (!updatedOrder) {
      return useOrderStore.getState().error || 'The order could not be cancelled.'
    }

    if (selectedOrder?.id === orderToCancel.id) setSelectedOrder(updatedOrder)
    setOrderToCancel(null)
    return true
  }

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase()
    const matchesSearch =
      String(order.id).toLowerCase().includes(query) ||
      String(order.customer || '').toLowerCase().includes(query)

    const matchesStatus =
      !filterValues.status ||
      order.status === filterValues.status

    const matchesPaymentStatus =
      !filterValues.paymentStatus ||
      order.paymentStatus === filterValues.paymentStatus

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPaymentStatus
    )
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortValue === 'date-desc') {
      return new Date(b.date) - new Date(a.date)
    }

    if (sortValue === 'date-asc') {
      return new Date(a.date) - new Date(b.date)
    }

    if (sortValue === 'total-desc') {
      return b.total - a.total
    }

    if (sortValue === 'total-asc') {
      return a.total - b.total
    }

    return 0
  })

  const totalItems = sortedOrders.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  return (
    <OwnerDashboardTemplate
      title="Orders"
      subtitle="Manage customer orders and monitor order progress."
      error={error}
      onRetry={loadOrders}
      loading={isLoading || !hasLoaded}
    >
      <OrdersManagement
        orders={paginatedOrders}
        loading={isLoading || !hasLoaded}
        canManage={canManageOrders}
        searchValue={search}
        filterValues={filterValues}
        sortValue={sortValue}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onSearchChange={(event) => {
          setSearch(event.target.value)
          setCurrentPage(1)
        }}
        onFilterChange={handleFilterChange}
        onSortChange={(value) => {
          setSortValue(value)
          setCurrentPage(1)
        }}
        onResetFilters={handleResetFilters}
        onPageChange={setCurrentPage}
        onViewOrder={handleViewOrder}
        onUpdateStatus={handleUpdateStatus}
      />
      {selectedOrder && (
        <RecordDetailsModal
          title={`Order ${selectedOrder.id}`}
          details={[
            { label: 'Customer', value: selectedOrder.customer },
            { label: 'Order Date', value: selectedOrder.date },
            {
              label: 'Items',
              value: Array.isArray(selectedOrder.items) ? (
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={`${item.name}-${index}`} className="flex justify-between gap-4">
                      <span>
                        {item.name}{item.size ? ` · ${item.size}` : ''} × {item.quantity}
                      </span>
                      <span className="shrink-0">
                        PKR {(Number(item.unitPrice) * Number(item.quantity)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                `${selectedOrder.itemCount ?? selectedOrder.items ?? 0} items`
              ),
            },
            { label: 'Total', value: `PKR ${Number(selectedOrder.total).toLocaleString()}` },
            { label: 'Payment Status', value: selectedOrder.paymentStatus },
            { label: 'Order Status', value: selectedOrder.status },
          ]}
          onClose={() => setSelectedOrder(null)}
        />
      )}
      {canManageOrders && orderToCancel && (
        <ConfirmActionModal
          title="Cancel Order?"
          message={`Cancel order ${orderToCancel.id} for ${orderToCancel.customer}? This action will update its order status.`}
          confirmLabel="Cancel Order"
          submittingLabel="Cancelling..."
          error={error}
          onClose={() => setOrderToCancel(null)}
          onConfirm={handleConfirmCancellation}
        />
      )}
    </OwnerDashboardTemplate>
  )
}

export default Orders
