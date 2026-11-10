import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import useAuthStore from './stores/authStore'

const EMPTY_PERMISSIONS = []

const Storefront = lazy(() => import('./pages/storefront/Storefront'))
const MenuPage = lazy(() => import('./pages/storefront/MenuPage'))
const ProductDetailPage = lazy(() => import('./pages/storefront/ProductDetailPage'))
const BagPage = lazy(() => import('./pages/storefront/BagPage'))
const CustomerAccountPage = lazy(() => import('./pages/storefront/CustomerAccountPage'))
const ContactPage = lazy(() => import('./pages/storefront/ContactPage'))
const NotFound = lazy(() => import('./pages/NotFound/NotFound'))
const Login = lazy(() => import('./pages/auth/Login/Login'))
const Dashboard = lazy(() => import('./pages/owner/Dashboard/Dashboard'))
const Products = lazy(() => import('./pages/owner/Products/Products'))
const Categories = lazy(() => import('./pages/owner/Categories/Categories'))
const Orders = lazy(() => import('./pages/owner/Orders/Orders'))
const Inventory = lazy(() => import('./pages/owner/Inventory/Inventory'))
const Employees = lazy(() => import('./pages/owner/Employees/Employees'))
const UserRoles = lazy(() => import('./pages/owner/UserRoles/UserRoles'))
const Payments = lazy(() => import('./pages/owner/Payments/Payments'))
const Reports = lazy(() => import('./pages/owner/Reports/Reports'))
const Settings = lazy(() => import('./pages/owner/Settings/Settings'))

function App() {
  const permissions = useAuthStore(
    (state) => state.user?.permissions ?? EMPTY_PERMISSIONS,
  )

  const protect = (permission, page) => (
    <ProtectedRoute permission={permission}>{page}</ProtectedRoute>
  )

  return (
      <Suspense
        fallback={
          <div className="p-8 text-sm text-text-secondary" role="status">
            Loading page...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Storefront />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/bag" element={<BagPage />} />
          <Route path="/account" element={<CustomerAccountPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/no-access"
            element={
              <main className="flex min-h-screen items-center justify-center p-6 text-center">
                <div className="max-w-md rounded-2xl border border-border-default bg-background-surface p-8">
                  <h1 className="text-xl font-semibold text-text-primary">No modules assigned</h1>
                  <p className="mt-2 text-sm text-text-secondary">
                    This demo role has no page permissions. Sign out and choose another role.
                  </p>
                  <button
                    type="button"
                    onClick={() => useAuthStore.getState().logout()}
                    className="mt-5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white"
                  >
                    Sign out
                  </button>
                </div>
              </main>
            }
          />
          <Route path="/owner/dashboard" element={protect('dashboard.view', <Dashboard />)} />
          <Route path="/owner/products" element={protect('products.view', <Products />)} />
          <Route path="/owner/categories" element={protect('categories.manage', <Categories />)} />
          <Route path="/owner/orders" element={protect('orders.view', <Orders />)} />
          <Route path="/owner/inventory" element={protect('inventory.view', <Inventory />)} />
          <Route path="/owner/employees" element={protect('employees.view', <Employees />)} />
          <Route path="/owner/user-roles" element={protect('roles.manage', <UserRoles />)} />
          <Route path="/owner/payments" element={protect('payments.view', <Payments />)} />
          <Route path="/owner/reports" element={protect('reports.view', <Reports />)} />
          <Route path="/owner/settings" element={protect('settings.view', <Settings />)} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
  )
}

export default App