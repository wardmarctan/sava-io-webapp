import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './input'

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

export function PasswordInput({ className = '', ...props }: Readonly<PasswordInputProps>) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <Input
        className={`password-field__input ${className}`.trim()}
        type={visible ? 'text' : 'password'}
        {...props}
      />
      <button type="button" className="password-field__toggle" onClick={() => setVisible((current) => !current)}>
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}