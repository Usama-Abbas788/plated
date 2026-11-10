import { TrendingUp, TrendingDown } from 'lucide-react'

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendType = 'up',
  description,
}) => {
  const isPositive = trendType === 'up'

  return (
    <div className="rounded-xl border border-border-default bg-white p-5 shadow-sm">

      {/* Top Section */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">
          {title}
        </p>

        {Icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-brand-primary">
            <Icon size={21} />
          </div>
        )}
      </div>

      {/* Value */}
      <h3 className="mt-4 text-2xl font-semibold text-text-primary">
        {value}
      </h3>

      {/* Trend */}
      {(trend || description) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">

          {trend && (
            <span
              className={`
                inline-flex items-center gap-1 text-xs font-medium
                ${isPositive ? 'text-status-success' : 'text-status-danger'}
              `}
            >
              {isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}

              {trend}
            </span>
          )}

          {description && (
            <span className="text-xs text-text-secondary">
              {description}
            </span>
          )}

        </div>
      )}

    </div>
  )
}

export default StatCard