import { ClipboardList } from 'lucide-react'
import Badge from '../../atoms/Badge/Badge'

const statusConfig = {
  Pending: {
    variant: 'warning',
    color: 'bg-amber-500',
  },
  Processing: {
    variant: 'info',
    color: 'bg-blue-500',
  },
  Completed: {
    variant: 'success',
    color: 'bg-green-500',
  },
  Cancelled: {
    variant: 'danger',
    color: 'bg-red-500',
  },
}

const OrderStatusSummary = ({
  statuses = [],
  title = 'Order Status',
  description = 'Overview of your current orders',
}) => {
  return (
    <section className="rounded-xl border border-border-default bg-background-surface p-5">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-brand-primary">
          <ClipboardList size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {title}
          </h2>

          <p className="text-sm text-text-secondary">
            {description}
          </p>
        </div>
      </div>

      {/* Status List */}
      <div className="space-y-5">
        {statuses.map((item) => {
          const config = statusConfig[item.status]

          if (!config) return null

          const totalOrders = statuses.reduce(
            (total, status) => total + status.count,
            0
          )

          const percentage = totalOrders
            ? (item.count / totalOrders) * 100
            : 0

          return (
            <div key={item.status}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${config.color}`}
                  />

                  <span className="text-sm font-medium text-text-primary">
                    {item.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">
                    {item.count}
                  </span>

                  <Badge variant={config.variant}>
                    {Math.round(percentage)}%
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}

        {statuses.length === 0 && (
          <p className="py-6 text-center text-sm text-text-secondary">
            No order status data available.
          </p>
        )}
      </div>
    </section>
  )
}

export default OrderStatusSummary