
import { useState } from 'react'
import Sidebar from '../../organisms/Sidebar/Sidebar'
import Header from '../../organisms/Header/Header'
import useAuthStore from '../../../stores/authStore'

const OwnerDashboardTemplate = ({
  children,
  title = 'Dashboard',
  subtitle = 'Welcome back! Here is your restaurant overview.',
  searchValue = '',
  onSearchChange,
  error,
  onRetry,
  loading = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [localSearchValue, setLocalSearchValue] = useState('')
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const effectiveSearchValue = onSearchChange ? searchValue : localSearchValue
  const effectiveSearchChange =
    onSearchChange ?? ((event) => setLocalSearchValue(event.target.value))

  const handleMenuClick = () => {
    setIsSidebarOpen((previous) => !previous)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-background-main">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main Content */}
      <div className="min-h-screen lg:pl-64">
        {/* Header */}
        <Header
          title={title}
          subtitle={subtitle}
          searchValue={effectiveSearchValue}
          onSearchChange={effectiveSearchChange}
          onMenuClick={handleMenuClick}
          user={user}
          onLogout={logout}
        />

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {error && (
            <div
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              <span>{error}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="font-semibold underline underline-offset-2"
                >
                  Retry
                </button>
              )}
            </div>
          )}
          {loading ? (
            <div className="rounded-lg border border-border-default bg-background-surface px-4 py-8 text-center text-sm text-text-secondary" role="status">
              Loading data...
            </div>
          ) : children}
        </main>
      </div>
    </div>
  )
}

export default OwnerDashboardTemplate
