import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import IconButton from '../../atoms/IconButton/IconButton'
import Input from '../../atoms/Input/Input'
import Label from '../../atoms/Label/Label'

const PasswordField = ({
  label = 'Password',
  name = 'password',
  value,
  onChange,
  placeholder = 'Enter your password',
  required = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name} required={required}>
        {label}
      </Label>

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pr-12"
        />

        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <IconButton
            icon={showPassword ? EyeOff : Eye}
            label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((previous) => !previous)}
            className="h-9 w-9"
          />
        </div>
      </div>

      {error && (
        <p className="text-xs text-status-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default PasswordField