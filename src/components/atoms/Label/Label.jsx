const Label = ({
  children,
  htmlFor,
  required = false,
  className = '',
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-text-primary ${className}`}
    >
      {children}

      {required && (
        <span className="ml-1 text-status-danger">*</span>
      )}
    </label>
  )
}

export default Label