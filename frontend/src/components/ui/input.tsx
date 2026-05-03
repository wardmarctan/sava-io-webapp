import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: Readonly<InputProps>) {
  return <input className={`input ${className}`.trim()} {...props} />
}