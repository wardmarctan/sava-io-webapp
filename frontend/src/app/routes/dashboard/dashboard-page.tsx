import { useRef, type RefObject } from 'react'
import { DashboardSidebar } from './components/dashboard-sidebar'
import { DashboardTopbar } from './components/dashboard-topbar'
import { SummaryCard } from './components/summary-card'
import { AccountsTable } from './components/accounts-table'
import { TransactionsTable } from './components/transactions-table'
import { QuickActions } from './components/quick-actions'
import { dashboardAccounts, dashboardSummary, dashboardTransactions } from './lib/dashboard-data'
import { useTranslation } from 'react-i18next'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  
  const accountsSectionRef = useRef<HTMLDivElement | null>(null)
  const transactionsSectionRef = useRef<HTMLDivElement | null>(null)

  const scrollToSection = (sectionRef: RefObject<HTMLDivElement | null>) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <main className="min-h-screen bg-[#f7f3fb] text-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />

          <div className="min-w-0 flex-1 overflow-auto px-6 py-6 lg:px-8">
            <section className="mb-5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{t('page.title')}</h1>
              <p className="mt-1 text-sm text-slate-700">{t('page.subtitle')}</p>
            </section>

            <section className="pb-1">
              <div className="grid grid-cols-4 gap-3">
                {dashboardSummary.map((item) => (
                  <SummaryCard key={item.label} label={t(`summary.${item.icon}`)} value={item.value} icon={item.icon} />
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
              <div className="grid gap-5">
                <div ref={accountsSectionRef}>
                  <AccountsTable accounts={dashboardAccounts} onViewAll={() => scrollToSection(accountsSectionRef)} />
                </div>
                <div ref={transactionsSectionRef}>
                  <TransactionsTable
                    transactions={dashboardTransactions}
                    onViewAll={() => scrollToSection(transactionsSectionRef)}
                  />
                </div>
              </div>

              <div className="grid gap-5">
                <QuickActions />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}