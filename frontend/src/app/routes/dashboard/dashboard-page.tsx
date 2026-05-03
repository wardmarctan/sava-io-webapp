import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { DashboardSidebar } from './components/dashboard-sidebar'
import { DashboardTopbar } from './components/dashboard-topbar'
import { SummaryCard } from './components/summary-card'
import { AccountsTable } from './components/accounts-table'
import { TransactionsTable } from './components/transactions-table'
import { QuickActions } from './components/quick-actions'
import { listCustomers } from '@/lib/api/customers/list-customer'
import { listAccounts } from '@/lib/api/accounts/list-account'
import { listDepositoTypes } from '@/lib/api/deposito-types/list-deposito-types'
import { listTransactions } from '@/lib/api/transactions/list-transaction'
import type { Account } from '@/lib/api/types/account/account'
import type { Transaction } from '@/lib/api/types/transaction/transaction'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const navigate = useNavigate()
  
  const accountsSectionRef = useRef<HTMLDivElement | null>(null)
  const transactionsSectionRef = useRef<HTMLDivElement | null>(null)
  const [counts, setCounts] = useState({ customers: 0, accounts: 0, depositoTypes: 0 })
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    let mounted = true
    const loadCounts = async () => {
      try {
        const [cRes, aRes, dRes, txRes] = await Promise.all([
          listCustomers(),
          listAccounts(),
          listDepositoTypes(),
          listTransactions(),
        ])
        if (!mounted) return
        setCounts({ customers: cRes.total ?? cRes.data.length, accounts: aRes.total ?? aRes.data.length, depositoTypes: dRes.total ?? dRes.data.length })
        setAccounts(aRes.data.slice(0, 5))
        setTransactions(txRes.data.slice(0, 5))
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Failed to load dashboard summary'
        toast.error(msg)
      }
    }
    void loadCounts()
    return () => {
      mounted = false
    }
  }, [])

  const summaryItems = useMemo(
    () => [
      { icon: 'customer' as const, label: t('summary.customer'), value: String(counts.customers) },
      { icon: 'account' as const, label: t('summary.account'), value: String(counts.accounts) },
      { icon: 'tag' as const, label: t('summary.tag'), value: String(counts.depositoTypes) },
    ],
    [counts.accounts, counts.customers, counts.depositoTypes, t],
  )

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
              <div className="grid grid-cols-3 gap-3">
                {summaryItems.map((item) => (
                  <SummaryCard key={item.icon} label={item.label} value={item.value} icon={item.icon} />
                ))}
              </div>
            </section>

            <section className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
              <div className="grid gap-5">
                <div ref={accountsSectionRef}>
                  <AccountsTable accounts={accounts} onViewAll={() => navigate('/accounts')} />
                </div>
                <div ref={transactionsSectionRef}>
                  <TransactionsTable
                    transactions={transactions}
                    onViewAll={() => navigate('/transaction-history')}
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