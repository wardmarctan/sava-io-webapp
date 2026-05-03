import { Link } from 'react-router'
import { UserRoundPlus, WalletCards, Tags, ArrowDownToLine } from 'lucide-react'

const actions = [
  { label: 'Add Customer', icon: UserRoundPlus, href: '/customers' },
  { label: 'Add Account', icon: WalletCards, href: '#' },
  { label: 'Add Deposito Type', icon: Tags, href: '#' },
  { label: 'Deposit', icon: ArrowDownToLine, href: '#' },
]

export function QuickActions() {
  return (
    <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
      <h2 className="mb-3 text-lg font-bold text-slate-950">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              to={action.href}
              className="flex min-h-14 items-center gap-3 rounded-xl border border-[#4a1f6c] bg-[#4a1f6c] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(74,31,108,0.24)] transition-transform hover:-translate-y-0.5"
              style={{ color: '#fff', backgroundColor: '#4a1f6c' }}
            >
              <Icon size={18} className="text-white" style={{ color: '#fff' }} />
              {action.label}
            </Link>
          )
        })}
      </div>
    </section>
  )
}