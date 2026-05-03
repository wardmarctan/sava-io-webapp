import { Link } from 'react-router'
import { UserRoundPlus, WalletCards, Tags, ArrowDownToLine } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function QuickActions() {
  const { t } = useTranslation('dashboard')

  const actions = [
    { label: t('quickActions.addCustomer'), icon: UserRoundPlus, href: '/customers?action=create' },
    { label: t('quickActions.addAccount'), icon: WalletCards, href: '/accounts?action=create' },
    { label: t('quickActions.addDepositoType'), icon: Tags, href: '/deposito-types?action=create' },
    { label: t('quickActions.deposit'), icon: ArrowDownToLine, href: '/deposit' },
  ]

  return (
    <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
      <h2 className="mb-3 text-lg font-bold text-slate-950">{t('page.quickActions')}</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          const content = (
            <>
              <Icon size={18} className="text-white" style={{ color: '#fff' }} />
              {action.label}
            </>
          )
          const className = "flex w-full min-h-14 items-center gap-3 rounded-xl border border-[#4a1f6c] bg-[#4a1f6c] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(74,31,108,0.24)] transition-transform hover:-translate-y-0.5"
          
          return (
            <Link
              key={action.label}
              to={action.href!}
              className={className}
              style={{ color: '#fff', backgroundColor: '#4a1f6c' }}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </section>
  )
}