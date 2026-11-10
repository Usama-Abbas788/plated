const IconButton = ({
  icon: Icon,
  label,
  onClick,
  variant = 'ghost',
  className = '',
  disabled = false,
}) => {
  const variants = {
    ghost: 'bg-transparent hover:bg-stone-100 text-text-primary',
    outline: 'border border-border-default hover:bg-stone-50 text-text-primary',
    danger: 'bg-red-50 hover:bg-red-100 text-status-danger',
  }

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex h-10 w-10 items-center justify-center
        rounded-md transition-colors
        disabled:cursor-not-allowed disabled:opacity-40
        ${variants[variant]}
        ${className}
      `}
    >
      <Icon size={18} />
    </button>
  )
}

export default IconButton