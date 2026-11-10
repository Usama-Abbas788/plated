
import {
  ShieldCheck,
  Pencil,
  Trash2,
  Plus,
  Users,
} from 'lucide-react'

import Badge from '../../atoms/Badge/Badge'
import Button from '../../atoms/Button/Button'
import IconButton from '../../atoms/IconButton/IconButton'

import DataTable from '../DataTable/DataTable'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '../Pagination/Pagination'

const UserRoleManagement = ({
  roles = [],

  searchValue = '',
  filterValues = {},
  sortValue = '',

  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,

  loading = false,

  onSearchChange,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onPageChange,

  onAddRole,
  onEditRole,
  onDeleteRole,
  onManagePermissions,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Role',
      render: (role) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-brand-primary">
            <ShieldCheck size={19} />
          </div>

          <div>
            <p className="font-medium text-text-primary">
              {role.name}
            </p>

            {role.isSystem && (
              <span className="text-xs text-text-secondary">
                System Role
              </span>
            )}
          </div>
        </div>
      ),
    },

    {
      key: 'description',
      label: 'Description',
      render: (role) => (
        <span className="text-sm text-text-secondary">
          {role.description || 'No description'}
        </span>
      ),
    },

    {
      key: 'employeeCount',
      label: 'Employees',
      render: (role) => (
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-text-secondary" />
          <span>{role.employeeCount ?? 0}</span>
        </div>
      ),
    },

    {
      key: 'permissions',
      label: 'Permissions',
      render: (role) => (
        <div className="flex flex-wrap gap-1.5">
          {(role.permissions || []).slice(0, 3).map((permission) => (
            <Badge key={permission} variant="info">
              {permission}
            </Badge>
          ))}

          {(role.permissions || []).length > 3 && (
            <Badge variant="neutral">
              +{role.permissions.length - 3} more
            </Badge>
          )}

          {(role.permissions || []).length === 0 && (
            <span className="text-xs text-text-secondary">
              No permissions
            </span>
          )}
        </div>
      ),
    },

    {
      key: 'status',
      label: 'Status',
      render: (role) => (
        <Badge variant={role.status === 'Active' ? 'success' : 'neutral'}>
          {role.status}
        </Badge>
      ),
    },

    {
      key: 'actions',
      label: 'Actions',
      render: (role) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={ShieldCheck}
            label="Manage permissions"
            onClick={() => onManagePermissions?.(role)}
          />

          {!role.isSystem && (
            <>
              <IconButton
                icon={Pencil}
                label="Edit role"
                onClick={() => onEditRole?.(role)}
              />

              <IconButton
                icon={Trash2}
                label={role.employeeCount > 0 ? 'Cannot delete a role assigned to employees' : 'Delete role'}
                variant="danger"
                disabled={role.employeeCount > 0}
                onClick={() => onDeleteRole?.(role)}
              />
            </>
          )}
        </div>
      ),
    },
  ]

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
      ],
    },
  ]

  const sortOptions = [
    { label: 'Role Name: A to Z', value: 'name-asc' },
    { label: 'Role Name: Z to A', value: 'name-desc' },
    { label: 'Fewest Employees', value: 'employeeCount-asc' },
    { label: 'Most Employees', value: 'employeeCount-desc' },
  ]

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            User Roles & Permissions
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Manage employee roles and control access to system features.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onAddRole}
        >
          <Plus size={18} />
          Create Role
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search roles..."
        filters={filters}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        sortOptions={sortOptions}
        sortValue={sortValue}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Roles Table */}
      <DataTable
        columns={columns}
        data={roles}
        loading={loading}
        emptyMessage="No roles found."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </section>
  )
}

export default UserRoleManagement
