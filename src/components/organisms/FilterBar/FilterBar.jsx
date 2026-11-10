import { Search, SlidersHorizontal, X } from 'lucide-react'
import Button from '../../atoms/Button/Button'
import Input from '../../atoms/Input/Input'

const FilterBar = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  filterValues = {},
  onFilterChange,
  sortOptions = [],
  sortValue = '',
  onSortChange,
  onReset,
}) => {
  const hasActiveFilters =
    searchValue !== '' ||
    Object.values(filterValues).some((value) => value !== '') ||
    sortValue !== ''

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-default bg-background-surface p-4">
      {/* Search */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />

          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={onSearchChange}
            className="border-0 bg-transparent pl-10 shadow-none focus:border-0 focus:ring-0"
          />
        </div>

        {/* Filter Label */}
        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <SlidersHorizontal size={17} />
          Filters
        </div>

        {/* Filter Dropdowns */}
        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filterValues[filter.key] || ''}
            onChange={(event) =>
              onFilterChange?.(filter.key, event.target.value)
            }
            className="plated-select h-10 rounded-xl border border-orange-100 bg-white px-3 text-sm text-text-primary outline-none transition hover:border-orange-300 focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">{filter.label}</option>

            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}

        {/* Sorting */}
        {sortOptions.length > 0 && (
          <select
            value={sortValue}
            onChange={(event) => onSortChange?.(event.target.value)}
            className="plated-select h-10 rounded-xl border border-orange-100 bg-white px-3 text-sm text-text-primary outline-none transition hover:border-orange-300 focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">Sort by</option>

            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="shrink-0"
          >
            <X size={16} />
            Reset
          </Button>
        )}
      </div>
    </div>
  )
}

export default FilterBar