import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className = '', type = 'button', ...props }: Readonly<ButtonProps>) {
  return <button type={type} className={`btn ${className}`.trim()} {...props} />
}