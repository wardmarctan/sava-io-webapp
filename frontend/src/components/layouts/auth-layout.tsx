import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <div className="auth-shell__glow auth-shell__glow--left" />
      <div className="auth-shell__glow auth-shell__glow--right" />
      <Outlet />
    </div>
  )
}