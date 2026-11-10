import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const SalesOverview = ({
  data = [],
  title = 'Sales Overview',
  description = 'Monitor your restaurant revenue over time.',
  totalRevenue = 'PKR 0',
}) => {
  return (
    <section className="rounded-xl border border-border-default bg-white p-5 md:p-6">

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            {title}
          </h2>

          <p className="mt-1 text-xs text-text-secondary">
            {description}
          </p>
        </div>

        <div>
          <p className="text-xs text-text-secondary">
            Total Revenue
          </p>

          <h3 className="mt-1 text-xl font-semibold text-brand-primary">
            {totalRevenue}
          </h3>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full sm:h-80">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="salesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#C2410C"
                    stopOpacity={0.2}
                  />

                  <stop
                    offset="95%"
                    stopColor="#C2410C"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E7E5E4"
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#78716C', fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#78716C', fontSize: 12 }}
                tickFormatter={(value) => `PKR ${Number(value).toLocaleString()}`}
              />

              <Tooltip
                formatter={(value) => [`PKR ${Number(value).toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  borderRadius: '10px',
                  border: '1px solid #E7E5E4',
                  fontSize: '12px',
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C2410C"
                strokeWidth={2.5}
                fill="url(#salesGradient)"
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-secondary">
            No sales data available.
          </div>
        )}
      </div>

    </section>
  )
}

export default SalesOverview