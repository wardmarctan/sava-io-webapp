import { ShieldCheck, Database, ArrowRight } from 'lucide-react'

export function AuthVisual() {
  return (
    <aside className="auth-visual">
      <div className="auth-visual__badge">
        <ShieldCheck size={16} />
        Temporary admin access
      </div>
      <h2>Structured backend, focused first step</h2>
      <p>
        The backend is being reorganized around a layered service flow and the database tables from the design board.
        Login is the first live surface.
      </p>
      <div className="auth-visual__stats">
        <div>
          <Database size={18} />
          <strong>Customers, accounts, deposito types, transactions</strong>
          <span>Captured in the backend schema plan.</span>
        </div>
        <div>
          <ArrowRight size={18} />
          <strong>admin / 123456</strong>
          <span>Temporary seed credentials for the login page.</span>
        </div>
      </div>
    </aside>
  )
}