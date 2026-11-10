import { AlertTriangle, ArrowRight, Package } from 'lucide-react'
import Badge from '../../atoms/Badge/Badge'

const LowStockAlerts = ({
  products = [],
  title = 'Low Stock Alerts',
  description = 'Products that need inventory replenishment.',
  onViewAll,
  onProductClick,
}) => {
  return (
    <section className="overflow-hidden rounded-xl border border-border-default bg-white">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border-default p-5">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-status-warning" />

            <h2 className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
          </div>

          <p className="mt-1 text-xs text-text-secondary">
            {description}
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

      {/* Product List */}
      <div className="divide-y divide-border-default">

        {products.length > 0 ? (
          products.map((product) => {
            const isOutOfStock = product.currentStock <= 0

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onProductClick?.(product)}
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-orange-50/50"
              >
                {/* Product Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-brand-primary">
                  <Package size={21} />
                </div>

                {/* Product Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-text-primary">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-xs text-text-secondary">
                    Minimum stock: {product.minimumStock} {product.unit}
                  </p>
                </div>

                {/* Stock Information */}
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-semibold text-text-primary">
                    {product.currentStock} {product.unit}
                  </span>

                  <Badge variant={isOutOfStock ? 'danger' : 'warning'}>
                    {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
                  </Badge>
                </div>

              </button>
            )
          })
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium text-status-success">
              All products are sufficiently stocked.
            </p>

            <p className="mt-1 text-xs text-text-secondary">
              No inventory alerts at the moment.
            </p>
          </div>
        )}

      </div>
    </section>
  )
}

export default LowStockAlerts