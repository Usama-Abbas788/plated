const DataTable = ({
  columns = [],
  data = [],
  getRowId = (row) => row.id,
  loading = false,
  emptyMessage = 'No records found.',
  onRowClick,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-border-default bg-background-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse text-left">
          {/* Table Header */}
          <thead className="bg-background-main">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-text-secondary ${
                    column.headerClassName || ''
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border-default">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-text-secondary"
                >
                  Loading records...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-text-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={getRowId(row) ?? rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors hover:bg-background-main ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`whitespace-nowrap px-5 py-4 text-sm text-text-primary ${
                        column.cellClassName || ''
                      }`}
                    >
                      {column.render
                        ? column.render(row)
                        : row[column.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable