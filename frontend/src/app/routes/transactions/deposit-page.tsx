import { useEffect, useMemo, useState } from 'react'

import { CalendarDays } from 'lucide-react'

import { DashboardSidebar } from '../dashboard/components/dashboard-sidebar'
import { DashboardTopbar } from '../dashboard/components/dashboard-topbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listAccounts } from '@/lib/api/accounts/list-account'
import type { Account } from '@/lib/api/types/account/account'
import { listDepositoTypes } from '@/lib/api/deposito-types/list-deposito-types'
import type { DepositoType } from '@/lib/api/types/deposito-type/deposito-type'
import { createTransaction } from '@/lib/api/transactions/create-transaction'
import { formatPercent, formatRupiahCompact } from '@/lib/format'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

function toIsoDate(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function DepositPage() {
  const { t } = useTranslation('deposit')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [depositoTypes, setDepositoTypes] = useState<DepositoType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [accountId, setAccountId] = useState<number | ''>('')
  const [date, setDate] = useState<string>(toIsoDate(new Date()))
  const [amount, setAmount] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [accRes, typeRes] = await Promise.all([listAccounts(), listDepositoTypes()])
        if (!mounted) return
        setAccounts(accRes.data)
        setDepositoTypes(typeRes.data)
      } catch (e) {
        if (!mounted) return
        const msg = e instanceof Error ? e.message : 'Failed to load deposit form'
        setError(msg)
        toast.error(msg)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [])

  const selected = useMemo(() => {
    if (accountId === '') return null
    return accounts.find((a) => a.id === accountId) ?? null
  }, [accountId, accounts])

  const yearlyReturn = useMemo(() => {
    if (!selected) return null
    const dt = depositoTypes.find((d) => d.id === selected.deposito_type_id)
    return dt?.yearly_return ?? null
  }, [depositoTypes, selected])

  const monthlyReturn = useMemo(() => {
    if (yearlyReturn == null) return null
    return yearlyReturn / 12
  }, [yearlyReturn])

  const dropdownLabel = (acc: Account) => `${acc.account_id} - ${acc.customer} (${acc.deposito_type})`

  const onSubmit = async () => {
    const todayIso = toIsoDate(new Date())
    if (accountId === '' || !date || amount.trim() === '') {
      toast.error(t('validation.required'))
      return
    }
    if (date > todayIso) {
      toast.error(t('validation.dateNotFuture'))
      return
    }
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error(t('validation.amountPositive'))
      return
    }

    setIsSubmitting(true)
    try {
      await createTransaction({ account_id: accountId, transaction_type: 'deposit', amount: amt, transaction_date: date })
      toast.success(t('toast.success'))
      setAmount('')
      // refresh accounts to show updated starting balance on next selection
      const accRes = await listAccounts()
      setAccounts(accRes.data)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to deposit'
      toast.error(`${t('toast.error')}: ${msg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3fb] text-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />

          <div className="min-w-0 flex-1 overflow-auto px-6 py-6 lg:px-8">
            <section className="mb-5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{t('title')}</h1>
              <p className="mt-1 text-sm text-slate-700">{t('subtitle')}</p>
            </section>

            {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#b89ed1] bg-white p-5 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
                <h2 className="mb-4 text-sm font-bold text-slate-950">{t('form.title')}</h2>

                {loading ? (
                  <div className="py-10 text-sm text-slate-500">{t('loading')}</div>
                ) : (
                  <div className="space-y-4">
                    <label className="field">
                      <span className="field__label">{t('form.account')}</span>
                      <div className="field__control">
                        <select
                          value={accountId}
                          onChange={(e) => setAccountId(e.target.value ? Number(e.target.value) : '')}
                          className="flex h-11 w-full rounded-xl border border-[#d8cbe6] bg-[#f9f6fc] px-4 text-sm text-slate-900 transition-colors focus:border-[#4a1f6c] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4a1f6c]"
                        >
                          <option value="" disabled>
                            {t('form.selectAccount')}
                          </option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {dropdownLabel(acc)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </label>

                    <label className="field">
                      <span className="field__label">{t('form.depositDate')}</span>
                      <div className="field__control">
                        <CalendarDays size={18} />
                        <Input type="date" value={date} max={toIsoDate(new Date())} onChange={(e) => setDate(e.target.value)} />
                      </div>
                    </label>

                    <label className="field">
                      <span className="field__label">{t('form.amount')}</span>
                      <div className="field__control">
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder={t('form.amountPlaceholder')}
                        />
                      </div>
                    </label>

                    <Button type="button" onClick={() => void onSubmit()} disabled={isSubmitting}>
                      {isSubmitting ? t('form.submitting') : t('form.submit')}
                    </Button>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#b89ed1] bg-white p-5 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
                <h2 className="mb-4 text-sm font-bold text-slate-950">{t('summary.title')}</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-slate-600">{t('summary.accountId')}</div>
                    <div className="font-semibold text-slate-950">{selected?.account_id ?? '-'}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-slate-600">{t('summary.customer')}</div>
                    <div className="font-semibold text-slate-950">{selected?.customer ?? '-'}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-slate-600">{t('summary.depositoType')}</div>
                    <div className="font-semibold text-slate-950">{selected?.deposito_type ?? '-'}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-slate-600">{t('summary.startingBalance')}</div>
                    <div className="font-semibold text-slate-950">
                      {selected ? formatRupiahCompact(selected.balance_raw) : '-'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-slate-600">{t('summary.yearlyReturn')}</div>
                    <div className="font-semibold text-slate-950">{yearlyReturn == null ? '-' : formatPercent(yearlyReturn, 2)}</div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-slate-600">{t('summary.monthlyReturn')}</div>
                    <div className="font-semibold text-slate-950">
                      {monthlyReturn == null ? '-' : `${formatPercent(monthlyReturn, 4)} (${formatPercent(yearlyReturn ?? 0, 2)} / 12)`}
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-[#d8cbe6] bg-[#f4edfb] px-4 py-3 text-xs font-semibold text-[#4a1f6c]">
                  {t('summary.note')}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

