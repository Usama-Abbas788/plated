import { Bell, Menu } from 'lucide-react'

import IconButton from '../../atoms/IconButton/IconButton'
import ProfileMenu from '../../molecules/ProfileMenu/ProfileMenu'
import SearchBar from '../../molecules/SearchBar/SearchBar'

const Header = ({
  title = 'Dashboard',
  subtitle = 'Welcome back! Here is your restaurant overview.',
  searchValue = '',
  onSearchChange,
  onMenuClick,
  onNotificationClick,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between gap-4 border-b border-border-default bg-white px-4 py-3 md:px-6 lg:px-8">

      {/* Left Section */}
      <div className="flex min-w-0 items-center gap-3">

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <IconButton
            icon={Menu}
            label="Open navigation menu"
            onClick={onMenuClick}
          />
        </div>

        {/* Page Information */}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-text-primary md:text-xl">
            {title}
          </h1>

          <p className="hidden truncate text-xs text-text-secondary sm:block">
            {subtitle}
          </p>
        </div>

      </div>

      {/* Right Section */}
      <div className="flex shrink-0 items-center gap-2 md:gap-4">

        {/* Search */}
        <div className="hidden w-48 md:block lg:w-64">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search..."
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <IconButton
            icon={Bell}
            label="Notifications"
            onClick={onNotificationClick}
          />

          {/* Notification Indicator */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-status-danger" />
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-border-default sm:block" />

        {/* Owner Profile */}
        <ProfileMenu
          name={user?.name || 'Restaurant User'}
          role={user?.role || 'Staff'}
          onLogout={onLogout}
        />

      </div>
    </header>
  )
}

export default Header