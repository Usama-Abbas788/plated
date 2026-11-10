import Input from '../../atoms/Input/Input'
import Label from '../../atoms/Label/Label'

const FormField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />

      {error && (
        <p className="text-xs text-status-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField