import Badge from '../../atoms/Badge/Badge'
import { ArrowRight } from 'lucide-react'

const statusVariants = {
  Completed: 'success',
  Pending: 'warning',
  Processing: 'info',
  Cancelled: 'danger',
}

const RecentOrders = ({
  orders = [],
  onViewAll,
  onOrderClick,
}) => {
  return (
    <section className="overflow-hidden rounded-xl border border-border-default bg-white">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border-default p-5">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Recent Orders
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            Keep track of your latest restaurant orders.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="flex shrink-0 items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary-hover"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">

          <thead className="bg-stone-50">
            <tr>
              {['Order ID', 'Customer', 'Date', 'Amount', 'Status'].map(
                (heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-secondary"
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-default">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => onOrderClick?.(order)}
                  className={onOrderClick ? 'cursor-pointer transition-colors hover:bg-orange-50/50' : ''}
                >
                  <td className="px-5 py-4 text-sm font-medium text-brand-primary">
                    #{order.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-text-primary">
                    {order.customer}
                  </td>

                  <td className="px-5 py-4 text-sm text-text-secondary">
                    {order.date}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-text-primary">
                    {order.amount}
                  </td>

                  <td className="px-5 py-4">
                    <Badge
                      variant={statusVariants[order.status] || 'neutral'}
                    >
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-text-secondary"
                >
                  No orders available.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </section>
  )
}

export default RecentOrders