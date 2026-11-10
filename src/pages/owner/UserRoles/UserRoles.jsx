import { useEffect, useMemo, useState } from 'react'
import OwnerDashboardTemplate from '../../../components/templates/OwnerDashboardTemplate/OwnerDashboardTemplate'
import UserRoleManagement from '../../../components/organisms/UserRoleManagement/UserRoleManagement'
import EntityFormModal from '../../../components/organisms/EntityFormModal/EntityFormModal'
import ConfirmActionModal from '../../../components/organisms/ConfirmActionModal/ConfirmActionModal'
import useRoleStore, { availablePermissions } from '../../../stores/domain/roleStore'
import useEmployeeStore from '../../../stores/domain/employeeStore'

function UserRoles() {
  const employees = useEmployeeStore((state) => state.employees)
  const loadEmployees = useEmployeeStore((state) => state.load)
  const employeesLoading = useEmployeeStore((state) => state.isLoading)
  const employeesLoaded = useEmployeeStore((state) => state.hasLoaded)
  const employeesError = useEmployeeStore((state) => state.error)
  const roles = useRoleStore((state) => state.roles)
  const loadRoles = useRoleStore((state) => state.load)
  const isLoading = useRoleStore((state) => state.isLoading)
  const hasLoaded = useRoleStore((state) => state.hasLoaded)
  const error = useRoleStore((state) => state.error)
  const addRole = useRoleStore((state) => state.addRole)
  const updateRole = useRoleStore((state) => state.updateRole)
  const deleteRole = useRoleStore((state) => state.deleteRole)
  const [searchValue, setSearchValue] = useState('')
  const [filterValues, setFilterValues] = useState({
    status: 'all',
  })
  const [sortValue, setSortValue] = useState('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [permissionsOnly, setPermissionsOnly] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)

  const pageSize = 5
  const rolesWithEmployeeCounts = useMemo(
    () => roles.map((role) => ({
      ...role,
      employeeCount: employees.filter((employee) => employee.role === role.name).length,
    })),
    [employees, roles],
  )

  useEffect(() => {
    loadRoles()
    loadEmployees()
  }, [loadEmployees, loadRoles])

  const filteredRoles = useMemo(() => {
    let result = [...rolesWithEmployeeCounts]

    // Search by role name or description
    if (searchValue.trim()) {
      const search = searchValue.toLowerCase()

      result = result.filter(
        (role) =>
          String(role.name || '').toLowerCase().includes(search) ||
          String(role.description || '').toLowerCase().includes(search)
      )
    }

    // Filter by status
    if (filterValues.status !== 'all') {
      result = result.filter(
        (role) => role.status === filterValues.status
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
      case 'employeeCount-asc':
        result.sort((a, b) => a.employeeCount - b.employeeCount)
        break
      case 'employeeCount-desc':
        result.sort((a, b) => b.employeeCount - a.employeeCount)
        break
      default:
        break
    }

    return result
  }, [rolesWithEmployeeCounts, searchValue, filterValues, sortValue])

  const totalItems = filteredRoles.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  const paginatedRoles = filteredRoles.slice(
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
      status: 'all',
    })
    setSortValue('name-asc')
    setCurrentPage(1)
  }

  const handleDeleteRole = async (role) => {
    if (role.isSystem || role.employeeCount > 0) return

    setRoleToDelete(role)
  }

  const handleConfirmDeleteRole = async () => {
    if (!roleToDelete || roleToDelete.isSystem || roleToDelete.employeeCount > 0) {
      return 'System roles and roles assigned to employees cannot be deleted.'
    }

    const deleted = await deleteRole(roleToDelete.id)
    if (!deleted) {
      return useRoleStore.getState().error || 'The role could not be deleted.'
    }

    setRoleToDelete(null)
    return true
  }

  const handleAddRole = () => {
    setSelectedRole(null)
    setPermissionsOnly(false)
    setIsModalOpen(true)
  }

  const handleEditRole = (role) => {
    setSelectedRole(role)
    setPermissionsOnly(false)
    setIsModalOpen(true)
  }

  const handleManagePermissions = (role) => {
    setSelectedRole(role)
    setPermissionsOnly(true)
    setIsModalOpen(true)
  }

  const handleSaveRole = async (formData) => {
    const normalizedName = formData.name?.trim()
    let savedRole
    if (selectedRole) {
      savedRole = await updateRole(selectedRole.id, {
        ...formData,
        ...(normalizedName ? { name: normalizedName } : {}),
      })
    } else {
      savedRole = await addRole({
        ...formData,
        name: normalizedName,
      })
    }
    if (!savedRole) return
    if (!selectedRole) setCurrentPage(1)
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedRole(null)
    setPermissionsOnly(false)
  }

  return (
    <OwnerDashboardTemplate
      title="User Roles & Permissions"
      subtitle="Control what each team role can access and manage."
      error={error || employeesError}
      onRetry={() => {
        loadRoles()
        loadEmployees()
      }}
      loading={isLoading || !hasLoaded || employeesLoading || !employeesLoaded}
    >
      <UserRoleManagement
        roles={paginatedRoles}
        loading={isLoading || !hasLoaded}
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
        onAddRole={handleAddRole}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
        onManagePermissions={handleManagePermissions}
      />
      {isModalOpen && (
        <EntityFormModal
          key={`${selectedRole?.id ?? 'new-role'}-${permissionsOnly ? 'permissions' : 'details'}`}
          entity={selectedRole}
          entityName={permissionsOnly ? 'Role Permissions' : 'Role'}
          fields={[
            ...(!permissionsOnly
              ? [
                  { name: 'name', label: 'Role Name', required: true },
                  { name: 'description', label: 'Description', type: 'textarea', required: true },
                  {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    defaultValue: 'Active',
                    options: [
                      { label: 'Active', value: 'Active' },
                      { label: 'Inactive', value: 'Inactive' },
                    ],
                  },
                ]
              : []),
            {
              name: 'permissions',
              label: 'Permissions',
              type: 'multiselect',
              required: true,
              options: availablePermissions.map((permission) => ({
                label: permission,
                value: permission,
              })),
            },
          ]}
          error={error || employeesError}
          validate={(values) => {
            if (permissionsOnly) return {}
            const duplicateName = roles.some((role) =>
              role.id !== selectedRole?.id &&
              String(role.name).trim().toLocaleLowerCase() === String(values.name).trim().toLocaleLowerCase(),
            )
            return duplicateName ? { name: 'A role with this name already exists.' } : {}
          }}
          onClose={handleCloseModal}
          onSubmit={handleSaveRole}
        />
      )}
      {roleToDelete && (
        <ConfirmActionModal
          title="Delete Role?"
          message={`Delete the ${roleToDelete.name} role? Users with this role may lose access to its permissions.`}
          error={error || employeesError}
          onClose={() => setRoleToDelete(null)}
          onConfirm={handleConfirmDeleteRole}
        />
      )}
    </OwnerDashboardTemplate>
  )
}

export default UserRoles