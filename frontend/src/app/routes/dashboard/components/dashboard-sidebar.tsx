import { LayoutGrid, Users, WalletCards, Tags, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react'
import { Link, useLocation } from 'react-router'

type MenuItem = {
  label: string
  icon: typeof LayoutGrid
  href: string
  active?: boolean
}

type MenuSection = {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: 'Main',
    items: [{ label: 'Dashboard', icon: LayoutGrid, active: true, href: '/' }],
  },
  {
    title: 'Master Data',
    items: [
      { label: 'Customers', icon: Users, href: '/customers' },
      { label: 'Accounts', icon: WalletCards, href: '#' },
      { label: 'Deposito Types', icon: Tags, href: '#' },
    ],
  },
  {
    title: 'Transactions',
    items: [
      { label: 'Deposit', icon: ArrowDownToLine, href: '#' },
      { label: 'Withdraw', icon: ArrowUpFromLine, href: '#' },
      { label: 'Transaction History', icon: History, href: '#' },
    ],
  },
]

export function DashboardSidebar() {
  const location = useLocation()

  return (
    <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 flex-col bg-[#4a1f6c] px-5 py-6 text-white shadow-[8px_0_24px_rgba(34,10,52,0.2)]">
      <div className="mb-10 text-2xl font-extrabold tracking-[0.18em]">SAVA.IO</div>

      <div className="flex flex-1 flex-col gap-8">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">{section.title}</h2>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = item.href !== '#' && location.pathname === item.href
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={[
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors',
                      isActive || item.active ? 'bg-white/12 text-white' : 'text-white/78 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}