import { useEffect, useMemo, useState } from 'react'
import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import EmployeesManagement from '../../../components/organisms/EmployeesManagement/EmployeesManagement'
import EntityFormModal from '../../../components/organisms/EntityFormModal/EntityFormModal'
import ConfirmActionModal from '../../../components/organisms/ConfirmActionModal/ConfirmActionModal'
import useEmployeeStore from '../../../stores/domain/employeeStore'
import useRoleStore from '../../../stores/domain/roleStore'
import useHasPermission from '../../../auth/useHasPermission'

function Employees() {
  const roles = useRoleStore((state) => state.roles)
  const loadRoles = useRoleStore((state) => state.load)
  const rolesLoading = useRoleStore((state) => state.isLoading)
  const rolesLoaded = useRoleStore((state) => state.hasLoaded)
  const rolesError = useRoleStore((state) => state.error)
  const canManageEmployees = useHasPermission('employees.manage')
  const employees = useEmployeeStore((state) => state.employees)
  const loadEmployees = useEmployeeStore((state) => state.load)
  const isLoading = useEmployeeStore((state) => state.isLoading)
  const hasLoaded = useEmployeeStore((state) => state.hasLoaded)
  const error = useEmployeeStore((state) => state.error)
  const addEmployee = useEmployeeStore((state) => state.addEmployee)
  const updateEmployee = useEmployeeStore((state) => state.updateEmployee)
  const deleteEmployee = useEmployeeStore((state) => state.deleteEmployee)
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState({
    role: 'all',
    department: 'all',
    status: 'all',
  })
  const [sortValue, setSortValue] = useState('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)

  const pageSize = 5

  useEffect(() => {
    loadEmployees()
    loadRoles()
  }, [loadEmployees, loadRoles])

  const employeeRoleOptions = [
    ...new Set([
      ...roles
        .filter((role) => role.status === 'Active')
        .map((role) => role.name),
      ...(selectedEmployee ? [selectedEmployee.role] : []),
    ]),
  ].filter(Boolean).sort((a, b) => a.localeCompare(b))

  const filteredEmployees = useMemo(() => {
    let result = [...employees]

    // Search by employee name, email, or phone
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase()

      result = result.filter(
        (employee) =>
          String(employee.name || '').toLowerCase().includes(search) ||
          String(employee.email || '').toLowerCase().includes(search) ||
          String(employee.phone || '').includes(search)
      )
    }

    // Filter by role
    if (filterValues.role !== 'all') {
      result = result.filter(
        (employee) => employee.role === filterValues.role
      )
    }

    // Filter by department
    if (filterValues.department !== 'all') {
      result = result.filter(
        (employee) => employee.department === filterValues.department
      )
    }

    // Filter by employment status
    if (filterValues.status !== 'all') {
      result = result.filter(
        (employee) => employee.status === filterValues.status
      )
    }

    // Sorting
    switch (sortValue) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'salary-asc':
        result.sort((a, b) => a.salary - b.salary)
        break
      case 'salary-desc':
        result.sort((a, b) => b.salary - a.salary)
        break
      case 'joiningDate-desc':
        result.sort(
          (a, b) => new Date(b.joiningDate) - new Date(a.joiningDate)
        )
        break
      default:
        break
    }

    return result
  }, [employees, searchValue, filterValues, sortValue])

  const totalItems = filteredEmployees.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (key, value) => {
    setFilterValues((previous) => ({ ...previous, [key]: value }))
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    setSortValue(value)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSearchValue('')
    setFilterValues({
      role: 'all',
      department: 'all',
      status: 'all',
    })
    setSortValue('name-asc')
    setCurrentPage(1)
  }

  const handleDeleteEmployee = async (employee) => {
    setEmployeeToDelete(employee)
  }

  const handleConfirmDeleteEmployee = async () => {
    if (!employeeToDelete) return 'The selected employee is no longer available.'

    const deleted = await deleteEmployee(employeeToDelete.id)
    if (!deleted) {
      return useEmployeeStore.getState().error || 'The employee could not be deleted.'
    }

    setEmployeeToDelete(null)
    return true
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsModalOpen(true)
  }

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  const handleSaveEmployee = async (formData) => {
    const normalizedEmail = formData.email.trim().toLocaleLowerCase()
    const duplicateEmail = employees.some((employee) =>
      employee.id !== selectedEmployee?.id &&
      String(employee.email).trim().toLocaleLowerCase() === normalizedEmail,
    )
    if (duplicateEmail) return

    let savedEmployee
    if (selectedEmployee) {
      savedEmployee = await updateEmployee(selectedEmployee.id, {
        ...formData,
        name: formData.name.trim(),
        email: normalizedEmail,
        phone: formData.phone.trim(),
      })
    } else {
      savedEmployee = await addEmployee({
        ...formData,
        name: formData.name.trim(),
        email: normalizedEmail,
        phone: formData.phone.trim(),
      })
    }
    if (!savedEmployee) return
    if (!selectedEmployee) setCurrentPage(1)
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  return (
    <OwnerDashboardTemplate
      title="Employees"
      subtitle="Manage your restaurant team and employee information."
      error={error || rolesError}
      onRetry={() => {
        loadEmployees()
        loadRoles()
      }}
      loading={isLoading || !hasLoaded || rolesLoading || !rolesLoaded}
    >
      <EmployeesManagement
        employees={paginatedEmployees}
        roles={[...new Set(employees.map((employee) => employee.role).filter(Boolean))].sort((a, b) => a.localeCompare(b))}
        departments={[...new Set(employees.map((employee) => employee.department).filter(Boolean))].sort((a, b) => a.localeCompare(b))}
        loading={isLoading || !hasLoaded}
        canManage={canManageEmployees}
        searchValue={searchValue}
        filterValues={filterValues}
        sortValue={sortValue}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onResetFilters={handleResetFilters}
        onPageChange={setCurrentPage}
        onAddEmployee={handleAddEmployee}
        onEditEmployee={handleEditEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />
      {isModalOpen && (
        <EntityFormModal
          key={selectedEmployee?.id ?? 'new-employee'}
          entity={selectedEmployee}
          entityName="Employee"
          fields={[
            { name: 'name', label: 'Full Name', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', required: true },
            {
              name: 'role',
              label: 'Role',
              type: 'select',
              required: true,
              options: employeeRoleOptions.map((role) => ({ label: role, value: role })),
            },
            {
              name: 'department',
              label: 'Department',
              type: 'select',
              required: true,
              options: ['Management', 'Kitchen', 'Service', 'Finance', 'Delivery'].map((department) => ({ label: department, value: department })),
            },
            { name: 'salary', label: 'Monthly Salary (PKR)', type: 'number', required: true, min: 0, step: 1, integer: true },
            { name: 'joiningDate', label: 'Joining Date', type: 'date', required: true },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              required: true,
              defaultValue: 'Active',
              options: ['Active', 'Inactive', 'On Leave'].map((status) => ({ label: status, value: status })),
            },
          ]}
          error={error || rolesError}
          validate={(values) => {
            const duplicateEmail = employees.some((employee) =>
              employee.id !== selectedEmployee?.id &&
              String(employee.email).trim().toLocaleLowerCase() === String(values.email).trim().toLocaleLowerCase(),
            )
            return duplicateEmail ? { email: 'This email address is already assigned to another employee.' } : {}
          }}
          onClose={handleCloseModal}
          onSubmit={handleSaveEmployee}
        />
      )}
      {canManageEmployees && employeeToDelete && (
        <ConfirmActionModal
          title="Delete Employee?"
          message={`Delete ${employeeToDelete.name} from the employee list? This action cannot be undone.`}
          error={error || rolesError}
          onClose={() => setEmployeeToDelete(null)}
          onConfirm={handleConfirmDeleteEmployee}
        />
      )}
    </OwnerDashboardTemplate>
  )
}

export default Employees