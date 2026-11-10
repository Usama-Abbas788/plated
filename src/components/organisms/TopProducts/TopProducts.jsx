import { ArrowRight, Package } from 'lucide-react'

const TopProducts = ({
  products = [],
  title = 'Top Selling Products',
  description = 'Your restaurant best-performing products.',
  onViewAll,
  onProductClick,
}) => {
  return (
    <section className="overflow-hidden rounded-xl border border-border-default bg-white">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border-default p-5">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {title}
          </h2>

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

      {/* Products */}
      <div className="divide-y divide-border-default">

        {products.length > 0 ? (
          products.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onProductClick?.(product)}
              className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-orange-50/50"
            >
              {/* Ranking */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-semibold text-brand-primary">
                {index + 1}
              </span>

              {/* Product Image */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package
                    size={22}
                    className="text-text-secondary"
                  />
                )}
              </div>

              {/* Product Information */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-text-primary">
                  {product.name}
                </h3>

                <p className="mt-1 text-xs text-text-secondary">
                  {product.category}
                </p>
              </div>

              {/* Sales Information */}
              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-text-primary">
                  PKR {Number(product.revenue).toLocaleString()}
                </p>

                <p className="mt-1 text-xs text-text-secondary">
                  {product.unitsSold} sold
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="px-5 py-10 text-center text-sm text-text-secondary">
            No product data available.
          </div>
        )}

      </div>
    </section>
  )
}

export default TopProducts