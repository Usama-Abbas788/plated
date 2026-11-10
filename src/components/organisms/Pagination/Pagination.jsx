import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '../../atoms/Button/Button'

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, '...', totalPages]
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      '...',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ]
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize = 10,
}) => {
  const safeTotalPages = Math.max(1, totalPages)

  const pages = getPageNumbers(
    currentPage,
    safeTotalPages
  )

  const startItem =
    totalItems === undefined || totalItems === 0
      ? 0
      : (currentPage - 1) * pageSize + 1

  const endItem =
    totalItems === undefined
      ? 0
      : Math.min(currentPage * pageSize, totalItems)

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= safeTotalPages &&
      page !== currentPage
    ) {
      onPageChange?.(page)
    }
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-border-default bg-background-surface px-4 py-4 sm:flex-row">
      {/* Records Information */}
      {totalItems !== undefined && (
        <p className="text-sm text-text-secondary">
          Showing{' '}
          <span className="font-medium text-text-primary">
            {startItem}-{endItem}
          </span>{' '}
          of{' '}
          <span className="font-medium text-text-primary">
            {totalItems}
          </span>{' '}
          records
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-2"
        >
          <ChevronLeft size={17} />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-text-secondary"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="min-w-9 px-2"
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= safeTotalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={17} />
        </Button>
      </div>
    </div>
  )
}

export default Pagination