import { UserPlus, Pencil, Trash2 } from 'lucide-react'

import Avatar from '../../atoms/Avatar/Avatar'
import Badge from '../../atoms/Badge/Badge'
import Button from '../../atoms/Button/Button'
import IconButton from '../../atoms/IconButton/IconButton'

import DataTable from '../DataTable/DataTable'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '../Pagination/Pagination'

const EmployeesManagement = ({
  employees = [],

  searchValue = '',
  filterValues = {},
  sortValue = '',

  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,

  loading = false,
  canManage = true,
  roles = [],
  departments = [],

  onSearchChange,
  onFilterChange,
  onSortChange,
  onResetFilters,
  onPageChange,

  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Employee',
      render: (employee) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={employee.avatar}
            name={employee.name}
            size="md"
          />

          <div>
            <p className="font-medium text-text-primary">
              {employee.name}
            </p>

            <p className="text-xs text-text-secondary">
              {employee.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'role',
      label: 'Assigned Role',
      render: (employee) => (
        <span className="font-medium text-text-primary">
          {employee.role}
        </span>
      ),
    },
    {
      key: 'joiningDate',
      label: 'Joining Date',
    },
    {
      key: 'salary',
      label: 'Monthly Salary',
      render: (employee) => `PKR ${Number(employee.salary).toLocaleString()}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (employee) => (
        <Badge
          variant={
            employee.status === 'Active'
              ? 'success'
              : 'neutral'
          }
        >
          {employee.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (employee) => (
        <div className="flex items-center gap-1">
          <IconButton
            icon={Pencil}
            label="Edit employee"
            onClick={() => onEditEmployee?.(employee)}
          />

          <IconButton
            icon={Trash2}
            label="Delete employee"
            variant="danger"
            onClick={() => onDeleteEmployee?.(employee)}
          />
        </div>
      ),
    },
  ]
  const visibleColumns = canManage
    ? columns
    : columns.filter((column) => column.key !== 'actions')

  return (
    <section className="space-y-5">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Employees
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Manage your restaurant team and employee information.
          </p>
        </div>

        {canManage && (
          <Button onClick={onAddEmployee}>
            <UserPlus size={18} />
            Add Employee
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <FilterBar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search employees..."
        filters={[
          {
            key: 'role',
            label: 'All Roles',
            options: roles.map((role) => ({ label: role, value: role })),
          },
          {
            key: 'status',
            label: 'All Statuses',
            options: [
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
              { label: 'On Leave', value: 'On Leave' },
            ],
          },
          {
            key: 'department',
            label: 'All Departments',
            options: departments.map((department) => ({
              label: department,
              value: department,
            })),
          },
        ]}
        filterValues={filterValues}
        onFilterChange={onFilterChange}
        sortOptions={[
          { label: 'Name: A to Z', value: 'name-asc' },
          { label: 'Name: Z to A', value: 'name-desc' },
          { label: 'Highest Salary', value: 'salary-desc' },
          { label: 'Lowest Salary', value: 'salary-asc' },
          { label: 'Newest Employees', value: 'joiningDate-desc' },
        ]}
        sortValue={sortValue}
        onSortChange={onSortChange}
        onReset={onResetFilters}
      />

      {/* Employees Table */}
      <DataTable
        columns={visibleColumns}
        data={employees}
        loading={loading}
        emptyMessage="No employees found."
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

export default EmployeesManagement