import { LayoutGrid, Users, WalletCards, Tags, ArrowDownToLine, ArrowUpFromLine, History } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'

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

export function DashboardSidebar() {
  const location = useLocation()
  const { t } = useTranslation('dashboard')

  const menuSections = [
    {
      title: t('sidebar.sections.main'),
      items: [{ label: t('sidebar.items.dashboard'), icon: LayoutGrid, href: '/' }],
    },
    {
      title: t('sidebar.sections.masterData'),
      items: [
        { label: t('sidebar.items.customers'), icon: Users, href: '/customers' },
        { label: t('sidebar.items.accounts'), icon: WalletCards, href: '#' },
        { label: t('sidebar.items.depositoTypes'), icon: Tags, href: '#' },
      ],
    },
    {
      title: t('sidebar.sections.transactions'),
      items: [
        { label: t('sidebar.items.deposit'), icon: ArrowDownToLine, href: '#' },
        { label: t('sidebar.items.withdraw'), icon: ArrowUpFromLine, href: '#' },
        { label: t('sidebar.items.transactionHistory'), icon: History, href: '#' },
      ],
    },
  ]

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