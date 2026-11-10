import { useEffect, useState } from 'react'
import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import ReportsOverview from '../../../components/organisms/ReportsOverview/ReportsOverview'
import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import useReportStore from '../../../stores/domain/reportStore'

function Reports() {
  const reportData = useReportStore((state) => state.reportData)
  const loadReportData = useReportStore((state) => state.load)
  const isLoading = useReportStore((state) => state.isLoading)
  const hasLoaded = useReportStore((state) => state.hasLoaded)
  const error = useReportStore((state) => state.error)
  const [dateRange, setDateRange] = useState('This Year')

  useEffect(() => {
    loadReportData({ period: dateRange })
  }, [dateRange, loadReportData])
  const summary = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: `PKR ${reportData.summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: `${reportData.summary.revenueGrowth > 0 ? '+' : ''}${reportData.summary.revenueGrowth}%`,
      trendType: reportData.summary.revenueGrowth >= 0 ? 'up' : 'down',
      description: 'Compared to previous period',
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: reportData.summary.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      trend: `${reportData.summary.ordersGrowth > 0 ? '+' : ''}${reportData.summary.ordersGrowth}%`,
      trendType: reportData.summary.ordersGrowth >= 0 ? 'up' : 'down',
      description: 'Compared to previous period',
    },
    {
      id: 'average-order',
      title: 'Average Order Value',
      value: `PKR ${reportData.summary.averageOrderValue.toLocaleString()}`,
      icon: TrendingUp,
      description: 'Average revenue per order',
    },
    {
      id: 'customers',
      title: 'Total Customers',
      value: reportData.summary.totalCustomers.toLocaleString(),
      icon: Users,
      description: 'Customers served',
    },
  ]

  const handleDateRangeChange = (value) => {
    setDateRange(value)
  }

  const handleExportReport = (format) => {
    if (format !== 'csv') return

    const escapeCsv = (value) => {
      const text = String(value ?? '')
      const safeText = typeof value === 'string' && /^[\t\r ]*[=+\-@]/.test(text)
        ? `'${text}`
        : text
      return `"${safeText.replace(/"/g, '""')}"`
    }
    const rows = [
      ['Period', dateRange],
      [],
      ['Summary Metric', 'Value'],
      ['Total Revenue (PKR)', reportData.summary.totalRevenue],
      ['Total Orders', reportData.summary.totalOrders],
      ['Average Order Value (PKR)', reportData.summary.averageOrderValue],
      ['Total Customers', reportData.summary.totalCustomers],
      ['Revenue Growth (%)', reportData.summary.revenueGrowth],
      ['Orders Growth (%)', reportData.summary.ordersGrowth],
      [],
      ['Sales Date', 'Revenue (PKR)', 'Orders'],
      ...reportData.salesData.map((item) => [item.date ?? item.name, item.revenue, item.orders ?? '']),
      [],
      ['Product', 'Category', 'Units Sold', 'Revenue (PKR)'],
      ...reportData.topProducts.map((product) => [
        product.name,
        product.category,
        product.unitsSold ?? product.sales,
        product.revenue,
      ]),
    ]
    const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8;',
    }))
    const link = document.createElement('a')
    link.href = url
    link.download = `plated-report-${dateRange.toLowerCase().replaceAll(' ', '-')}.csv`
    document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <OwnerDashboardTemplate
      title="Reports & Analytics"
      subtitle="Understand your restaurant performance through business reports."
      error={error}
      onRetry={() => loadReportData({ period: dateRange })}
      loading={isLoading || !hasLoaded}
    >
      <ReportsOverview
        summary={summary}
        salesData={reportData.salesData}
        topProducts={reportData.topProducts.map((product) => ({
          ...product,
          unitsSold: product.unitsSold ?? product.sales,
        }))}
        period={dateRange}
        onPeriodChange={handleDateRangeChange}
        onExportReport={() => handleExportReport('csv')}
      />
    </OwnerDashboardTemplate>
  )
}

export default Reports