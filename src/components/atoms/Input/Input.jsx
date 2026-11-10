const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  name,
  id,
  disabled = false,
  className = '',
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        w-full rounded-md border border-border-default
        bg-white px-4 py-2.5 text-sm text-text-primary
        placeholder:text-text-secondary
        outline-none transition-all
        focus:border-brand-primary focus:ring-2
        focus:ring-brand-primary/20
        disabled:cursor-not-allowed disabled:bg-stone-100
        ${className}
      `}
    />
  )
}

export default Input