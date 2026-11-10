
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'

import DashboardOverview from '../../../components/organisms/DashboardOverview/DashboardOverview'
import RecentOrders from '../../../components/organisms/RecentOrders/RecentOrders'
import SalesOverview from '../../../components/organisms/SalesOverview/SalesOverview'
import TopProducts from '../../../components/organisms/TopProducts/TopProducts'
import LowStockAlerts from '../../../components/organisms/LowStockAlerts/LowStockAlerts'
import QuickActions from '../../../components/organisms/QuickActions/QuickActions'
import OrderStatusSummary from '../../../components/organisms/OrderStatusSummary/OrderStatusSummary'

import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  PackagePlus,
  Tags,
  UserPlus,
  ClipboardList,
} from 'lucide-react'
import useDashboardStore from '../../../stores/domain/dashboardStore'
import useOrderStore from '../../../stores/domain/orderStore'
import useInventoryStore from '../../../stores/domain/inventoryStore'
import useAuthStore from '../../../stores/authStore'

const Dashboard = () => {
  const navigate = useNavigate()
  const permissions = useAuthStore((state) => state.user?.permissions ?? [])
  const dashboardData = useDashboardStore((state) => state.dashboardData)
  const loadDashboardData = useDashboardStore((state) => state.load)
  const dashboardError = useDashboardStore((state) => state.error)
  const dashboardLoading = useDashboardStore((state) => state.isLoading)
  const dashboardLoaded = useDashboardStore((state) => state.hasLoaded)
  const orders = useOrderStore((state) => state.orders)
  const loadOrders = useOrderStore((state) => state.load)
  const ordersError = useOrderStore((state) => state.error)
  const ordersLoading = useOrderStore((state) => state.isLoading)
  const ordersLoaded = useOrderStore((state) => state.hasLoaded)
  const inventory = useInventoryStore((state) => state.inventory)
  const loadInventory = useInventoryStore((state) => state.load)
  const inventoryError = useInventoryStore((state) => state.error)
  const inventoryLoading = useInventoryStore((state) => state.isLoading)
  const inventoryLoaded = useInventoryStore((state) => state.hasLoaded)

  useEffect(() => {
    loadDashboardData()
    loadOrders()
    loadInventory()
  }, [loadDashboardData, loadInventory, loadOrders])

  const statIcons = {
    revenue: DollarSign,
    orders: ShoppingBag,
    customers: Users,
    averageOrder: TrendingUp,
  }
  const actionIcons = {
    product: PackagePlus,
    category: Tags,
    employee: UserPlus,
    orders: ClipboardList,
  }
  const stats = dashboardData.stats.map((stat) => ({
    ...stat,
    icon: statIcons[stat.icon],
  }))
  const quickActions = dashboardData.quickActions.map((action) => ({
    ...action,
    icon: actionIcons[action.icon],
  }))
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((order) => ({
    ...order,
    amount: `PKR ${Number(order.total).toLocaleString()}`,
  }))
  const orderStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'].map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }))
  const lowStockProducts = inventory
    .filter((item) => Number(item.quantity) <= Number(item.minimumStock))
    .sort((a, b) => Number(a.quantity) - Number(b.quantity))
    .map((item) => ({
      id: item.id,
      name: item.name,
      currentStock: item.quantity,
      minimumStock: item.minimumStock,
      unit: item.unit,
    }))

  const handleQuickAction = (actionId) => {
    const destinations = {
      'add-product': '/owner/products',
      'create-category': '/owner/categories',
      'add-employee': '/owner/employees',
      'view-orders': '/owner/orders',
    }

    const destination = destinations[actionId]
    if (destination) navigate(destination)
  }
  const visibleQuickActions = quickActions.filter((action) => {
    const requiredPermissions = {
      'add-product': ['products.manage'],
      'create-category': ['categories.manage'],
      'add-employee': ['employees.manage'],
      'view-orders': ['orders.view'],
    }

    return requiredPermissions[action.id]?.some((permission) =>
      permissions.includes(permission),
    )
  })
  const weeklyRevenue = dashboardData.salesData.reduce(
    (total, item) => total + Number(item.revenue || 0),
    0,
  )

  return (
    <OwnerDashboardTemplate
      title="Dashboard"
      subtitle="Welcome back! Here's your restaurant overview."
      error={dashboardError || ordersError || inventoryError}
      loading={
        dashboardLoading ||
        ordersLoading ||
        inventoryLoading ||
        !dashboardLoaded ||
        !ordersLoaded ||
        !inventoryLoaded
      }
      onRetry={() => {
        loadDashboardData()
        loadOrders()
        loadInventory()
      }}
    >
      <div className="space-y-6">
        <DashboardOverview
          stats={stats}
          title="Business Overview"
          description="Your restaurant performance at a glance."
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <SalesOverview
              data={dashboardData.salesData}
              title="Sales Overview"
              description="Revenue performance over the last seven days."
              totalRevenue={`PKR ${weeklyRevenue.toLocaleString()}`}
            />
          </div>

          <OrderStatusSummary
            statuses={orderStatuses}
            title="Order Status"
            description="Current order distribution."
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentOrders
            orders={recentOrders}
            onViewAll={() => navigate('/owner/orders')}
            onOrderClick={() => navigate('/owner/orders')}
          />

          <TopProducts
            products={dashboardData.topProducts}
            onViewAll={() => navigate('/owner/products')}
            onProductClick={() => navigate('/owner/products')}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <LowStockAlerts
            products={lowStockProducts}
            onViewAll={() => navigate('/owner/inventory')}
            onProductClick={() => navigate('/owner/inventory')}
          />

          <QuickActions
            actions={visibleQuickActions}
            onActionClick={handleQuickAction}
          />
        </div>
      </div>
    </OwnerDashboardTemplate>
  )
}

export default Dashboard
