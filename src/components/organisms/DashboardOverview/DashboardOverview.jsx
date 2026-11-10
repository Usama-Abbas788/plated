import StatCard from '../../molecules/StatCard/StatCard'

const DashboardOverview = ({
  stats = [],
  title = 'Business Overview',
  description = 'Here is an overview of your restaurant performance.',
}) => {
  return (
    <section className="space-y-5">

      {/* Section Heading */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          {title}
        </h2>

        <p className="mt-1 text-sm text-text-secondary">
          {description}
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendType={stat.trendType}
            description={stat.description}
          />
        ))}
      </div>

    </section>
  )
}

export default DashboardOverview