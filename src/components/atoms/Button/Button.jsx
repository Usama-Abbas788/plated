const variants = {
  primary:
    'bg-brand-primary text-white hover:bg-brand-primary-hover',

  secondary:
    'bg-brand-secondary text-white hover:opacity-90',

  outline:
    'border border-border-default bg-white text-text-primary hover:bg-stone-50',

  ghost:
    'bg-transparent text-text-primary hover:bg-stone-100',

  danger:
    'bg-status-danger text-white hover:opacity-90',
}

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2
        focus:ring-brand-primary focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button