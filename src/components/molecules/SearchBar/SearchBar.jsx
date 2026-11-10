import { Search, X } from 'lucide-react'
import IconButton from '../../atoms/IconButton/IconButton'
import Input from '../../atoms/Input/Input'

const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div
      className={`
        flex items-center gap-2 rounded-md
        bg-transparent px-3 transition-all
        ${className}
      `}
    >
      <Search
        size={18}
        className="shrink-0 text-text-secondary"
      />

      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border-0 bg-transparent px-1 shadow-none focus:border-0 focus:ring-0"
      />

      {value && (
        <IconButton
          icon={X}
          label="Clear search"
          onClick={() => onChange?.({ target: { value: '' } })}
          className="h-8 w-8"
        />
      )}
    </div>
  )
}

export default SearchBar