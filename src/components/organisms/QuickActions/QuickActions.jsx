import {
  ArrowUpRight,
} from 'lucide-react'

const QuickActions = ({
  actions = [],
  title = 'Quick Actions',
  description = 'Shortcuts to frequently used tasks',
  onActionClick,
}) => {
  return (
    <section className="rounded-xl border border-border-default bg-background-surface p-5">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-text-primary">
          {title}
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onActionClick?.(action.id)}
              className="group flex items-center gap-3 rounded-lg border border-border-default p-4 text-left transition hover:border-brand-primary hover:bg-background-main"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-brand-primary transition group-hover:bg-brand-primary group-hover:text-white">
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-text-primary">
                  {action.label}
                </h3>

                <p className="mt-1 text-xs text-text-secondary">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight
                size={17}
                className="shrink-0 text-text-secondary transition group-hover:text-brand-primary"
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default QuickActions