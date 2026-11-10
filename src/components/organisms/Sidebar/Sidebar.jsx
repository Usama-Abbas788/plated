import { NavLink } from 'react-router-dom'

import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Warehouse,
  Users,
  CreditCard,
  ChartNoAxesCombined,
  Settings,
  ChefHat,
  X,
  ShieldCheck,
} from 'lucide-react'
import useAuthStore from '../../../stores/authStore'

const EMPTY_PERMISSIONS = []

const navigationItems = [
  {
    title: 'Dashboard',
    path: '/owner/dashboard',
    icon: LayoutDashboard,
    permission: 'dashboard.view',
  },
  {
    title: 'Products',
    path: '/owner/products',
    icon: Package,
    permission: 'products.view',
  },
  {
    title: 'Categories',
    path: '/owner/categories',
    icon: Tags,
    permission: 'categories.manage',
  },
  {
    title: 'Orders',
    path: '/owner/orders',
    icon: ShoppingBag,
    permission: 'orders.view',
  },
  {
    title: 'Inventory',
    path: '/owner/inventory',
    icon: Warehouse,
    permission: 'inventory.view',
  },
  {
    title: 'Employees',
    path: '/owner/employees',
    icon: Users,
    permission: 'employees.view',
  },
  {
    title: 'User Roles',
    path: '/owner/user-roles',
    icon: ShieldCheck,
    permission: 'roles.manage',
  },
  {
    title: 'Payments',
    path: '/owner/payments',
    icon: CreditCard,
    permission: 'payments.view',
  },
  {
    title: 'Reports',
    path: '/owner/reports',
    icon: ChartNoAxesCombined,
    permission: 'reports.view',
  },
  {
    title: 'Settings',
    path: '/owner/settings',
    icon: Settings,
    permission: 'settings.view',
  },
]

const Sidebar = ({ isOpen = true, onClose }) => {
  const permissions = useAuthStore(
    (state) => state.user?.permissions ?? EMPTY_PERMISSIONS,
  )
  const visibleNavigationItems = navigationItems.filter((item) =>
    permissions.includes(item.permission),
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col bg-background-sidebar text-white
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary">
              <ChefHat size={24} />
            </div>

            <div>
              <h1 className="text-xl font-bold">Plated</h1>
              <p className="text-xs text-stone-400">
                Restaurant Management
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="hide-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto px-4 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Management
          </p>

          {visibleNavigationItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-lg
                  px-3 py-3 text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : 'text-stone-300 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                <Icon size={19} />
                <span>{item.title}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <p className="text-center text-xs text-stone-500">
            Plated Restaurant System
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar