import { useEffect, useMemo, useState } from 'react'
import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import PaymentsManagement from '../../../components/organisms/PaymentsManagement/PaymentsManagement'
import RecordDetailsModal from '../../../components/organisms/RecordDetailsModal/RecordDetailsModal'
import ConfirmActionModal from '../../../components/organisms/ConfirmActionModal/ConfirmActionModal'
import Button from '../../../components/atoms/Button/Button'
import usePaymentStore from '../../../stores/domain/paymentStore'
import useOrderStore from '../../../stores/domain/orderStore'
import useHasPermission from '../../../auth/useHasPermission'

function Payments() {
  const canManagePayments = useHasPermission('payments.manage')
  const payments = usePaymentStore((state) => state.payments)
  const loadPayments = usePaymentStore((state) => state.load)
  const isLoading = usePaymentStore((state) => state.isLoading)
  const hasLoaded = usePaymentStore((state) => state.hasLoaded)
  const error = usePaymentStore((state) => state.error)
  const updatePayment = usePaymentStore((state) => state.updatePayment)
  const loadOrders = useOrderStore((state) => state.load)
  const updateOrder = useOrderStore((state) => state.updateOrder)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentToRefund, setPaymentToRefund] = useState(null)
  const [refundSyncIssue, setRefundSyncIssue] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState({
    status: 'all',
    method: 'all',
  })
  const [sortValue, setSortValue] = useState('date-desc')
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 5

  useEffect(() => {
    loadPayments()
    loadOrders()
  }, [loadOrders, loadPayments])

  const filteredPayments = useMemo(() => {
    let result = [...payments]

    // Search by transaction ID, order ID, or customer
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase()

      result = result.filter(
        (payment) =>
          String(payment.transactionId || '').toLowerCase().includes(search) ||
          String(payment.orderId || '').toLowerCase().includes(search) ||
          String(payment.customer || '').toLowerCase().includes(search)
      )
    }

    // Filter by payment status
    if (filterValues.status !== 'all') {
      result = result.filter(
        (payment) => payment.status === filterValues.status
      )
    }

    // Filter by payment method
    if (filterValues.method !== 'all') {
      result = result.filter(
        (payment) => payment.method === filterValues.method
      )
    }

    // Sorting
    switch (sortValue) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'date-asc':
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount)
        break
      case 'amount-asc':
        result.sort((a, b) => a.amount - b.amount)
        break
      default:
        break
    }

    return result
  }, [payments, searchValue, filterValues, sortValue])

  const totalItems = filteredPayments.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilterValues((previous) => ({ ...previous, [key]: value }))
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortValue(value)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchValue('')
    setFilterValues({
      status: 'all',
      method: 'all',
    })
    setSortValue('date-desc')
    setCurrentPage(1)
  }

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment)
    setPaymentToRefund(null)
  }

  const handleRefundPayment = (payment) => {
    setSelectedPayment(null)
    setPaymentToRefund(payment)
  }

  const handleConfirmRefund = async () => {
    if (!paymentToRefund || !['Paid', 'Completed'].includes(paymentToRefund.status)) {
      return 'This payment is no longer eligible for a refund.'
    }

    const refundedPayment = await updatePayment(paymentToRefund.id, { status: 'Refunded' })
    if (!refundedPayment) {
      return usePaymentStore.getState().error || 'The payment could not be refunded.'
    }

    if (!useOrderStore.getState().hasLoaded) await loadOrders()

    const orderState = useOrderStore.getState()
    const relatedOrder = orderState.orders.find(
      (order) => String(order.id) === String(paymentToRefund.orderId),
    )

    if (!relatedOrder) {
      setRefundSyncIssue({
        orderId: paymentToRefund.orderId,
        transactionId: paymentToRefund.transactionId,
        syncError: orderState.error || 'The related order could not be found.',
      })
    } else if (relatedOrder.paymentStatus !== 'Refunded') {
      const updatedOrder = await updateOrder(relatedOrder.id, { paymentStatus: 'Refunded' })
      if (!updatedOrder) {
        setRefundSyncIssue({
          orderId: relatedOrder.id,
          transactionId: paymentToRefund.transactionId,
          syncError: useOrderStore.getState().error || 'The linked order could not be updated.',
        })
      }
    }

    setPaymentToRefund(null)
    return true
  }

  const handleRetryOrderSync = async () => {
    if (!refundSyncIssue) return

    if (!useOrderStore.getState().hasLoaded) await loadOrders()

    const orderState = useOrderStore.getState()
    const relatedOrder = orderState.orders.find(
      (order) => String(order.id) === String(refundSyncIssue.orderId),
    )
    if (!relatedOrder) {
      setRefundSyncIssue((issue) => ({
        ...issue,
        syncError: orderState.error || 'The linked order could not be found.',
      }))
      return
    }

    const updatedOrder = await updateOrder(relatedOrder.id, { paymentStatus: 'Refunded' })
    if (updatedOrder) {
      setRefundSyncIssue(null)
    } else {
      setRefundSyncIssue((issue) => ({
        ...issue,
        syncError: useOrderStore.getState().error || 'The linked order could not be updated.',
      }))
    }
  }

  return (
    <OwnerDashboardTemplate
      title="Payments"
      subtitle="Track transactions, payment methods, and payment statuses."
      error={error}
      onRetry={loadPayments}
      loading={isLoading || !hasLoaded}
    >
      <PaymentsManagement
        payments={paginatedPayments}
        loading={isLoading || !hasLoaded}
        canManage={canManagePayments}
        searchValue={searchValue}
        filterValues={filterValues}
        sortValue={sortValue}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onPageChange={setCurrentPage}
        onViewPayment={handleViewPayment}
        onRefundPayment={handleRefundPayment}
      />
      {refundSyncIssue && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Payment {refundSyncIssue.transactionId} was refunded, but order {refundSyncIssue.orderId} could not be updated. {refundSyncIssue.syncError}
          </p>
          <Button type="button" variant="outline" onClick={handleRetryOrderSync}>
            Retry order update
          </Button>
        </div>
      )}
      {selectedPayment && (
        <RecordDetailsModal
          title={`Payment ${selectedPayment.transactionId}`}
          details={[
            { label: 'Transaction ID', value: selectedPayment.transactionId },
            { label: 'Order ID', value: selectedPayment.orderId },
            { label: 'Customer', value: selectedPayment.customer },
            { label: 'Amount', value: `PKR ${Number(selectedPayment.amount).toLocaleString()}` },
            { label: 'Method', value: selectedPayment.method },
            { label: 'Date', value: selectedPayment.date },
            { label: 'Status', value: selectedPayment.status },
          ]}
          onClose={() => {
            setSelectedPayment(null)
          }}
        />
      )}
      {paymentToRefund && (
        <ConfirmActionModal
          title="Refund Payment?"
          message={`Refund PKR ${Number(paymentToRefund.amount).toLocaleString()} for transaction ${paymentToRefund.transactionId} on order ${paymentToRefund.orderId}?`}
          confirmLabel="Confirm Refund"
          submittingLabel="Refunding..."
          error={error}
          onClose={() => setPaymentToRefund(null)}
          onConfirm={handleConfirmRefund}
        />
      )}
    </OwnerDashboardTemplate>
  )
}

export default Payments