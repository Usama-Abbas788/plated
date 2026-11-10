
import { Download } from 'lucide-react'

import Button from '../../atoms/Button/Button'
import StatCard from '../../molecules/StatCard/StatCard'
import SalesOverview from '../SalesOverview/SalesOverview'
import DataTable from '../DataTable/DataTable'

const ReportsOverview = ({
  summary = [],
  salesData = [],
  topProducts = [],
  period = 'This Month',
  onPeriodChange,
  onExportReport,
}) => {
  const periodOptions = [
    'Today',
    'This Week',
    'This Month',
    'This Year',
  ]

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (product) => (
        <span className="font-medium text-text-primary">
          {product.name}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'unitsSold',
      label: 'Units Sold',
    },
    {
      key: 'revenue',
      label: 'Revenue',
      render: (product) => (
        <span className="font-medium text-text-primary">
          PKR {Number(product.revenue).toLocaleString()}
        </span>
      ),
    },
  ]

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Business Reports
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Analyze your restaurant's sales and business performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={period}
            onChange={(event) => onPeriodChange?.(event.target.value)}
            className="plated-select rounded-xl border border-orange-100 bg-background-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-orange-600"
          >
            {periodOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            onClick={onExportReport}
          >
            <Download size={17} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
            trendType={item.trendType}
            description={item.description}
          />
        ))}
      </div>

      {/* Sales Chart */}
      <SalesOverview
        data={salesData}
        title="Revenue Performance"
        description={`Revenue trends for ${period.toLowerCase()}.`}
      />

      {/* Top Selling Products */}
      <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface">
        <div className="border-b border-border-default p-5">
          <h3 className="font-semibold text-text-primary">
            Top Selling Products
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            Products generating the highest revenue.
          </p>
        </div>

        <DataTable
          columns={columns}
          data={topProducts}
          emptyMessage="No product sales available for this period."
        />
      </div>
    </section>
  )
}

export default ReportsOverview
