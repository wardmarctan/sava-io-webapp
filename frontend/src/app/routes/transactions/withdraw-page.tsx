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

type CalcResult = {
  startingBalance: number
  monthlyReturnPercent: number
  months: number
  returnAmount: number
  endingBalance: number
}

export function WithdrawPage() {
  const { t } = useTranslation('withdraw')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [depositoTypes, setDepositoTypes] = useState<DepositoType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [accountId, setAccountId] = useState<number | ''>('')
  const [date, setDate] = useState<string>(toIsoDate(new Date()))
  const [amount, setAmount] = useState<string>('')
  const [months, setMonths] = useState<string>('1')
  const [calc, setCalc] = useState<CalcResult | null>(null)
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
        const msg = e instanceof Error ? e.message : 'Failed to load withdraw form'
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

  const monthlyReturnPercent = useMemo(() => {
    if (yearlyReturn == null) return null
    return yearlyReturn / 12
  }, [yearlyReturn])

  const dropdownLabel = (acc: Account) => `${acc.account_id} - ${acc.customer} (${acc.deposito_type})`

  const onCalculate = () => {
    setCalc(null)
    const todayIso = toIsoDate(new Date())
    if (accountId === '' || !date || amount.trim() === '' || months.trim() === '') {
      toast.error(t('validation.required'))
      return
    }
    if (date > todayIso) {
      toast.error(t('validation.dateNotFuture'))
      return
    }
    if (!selected || yearlyReturn == null || monthlyReturnPercent == null) {
      toast.error(t('validation.selectAccount'))
      return
    }

    const amt = Number(amount)
    const m = Number(months)
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error(t('validation.amountPositive'))
      return
    }
    if (!Number.isFinite(m) || m <= 0) {
      toast.error(t('validation.monthsPositive'))
      return
    }

    const starting = selected.balance_raw
    const monthlyRate = (yearlyReturn / 12) / 100
    const ret = starting * m * monthlyRate
    const ending = starting + ret - amt

    if (ending < 0) {
      toast.error(t('validation.insufficient'))
      return
    }

    setCalc({
      startingBalance: starting,
      monthlyReturnPercent,
      months: m,
      returnAmount: ret,
      endingBalance: ending,
    })
  }

  const onConfirmWithdraw = async () => {
    if (!calc || accountId === '') return
    if (calc.endingBalance < 0) {
      toast.error(t('validation.insufficient'))
      return
    }

    const amt = Number(amount)
    const m = Number(months)

    setIsSubmitting(true)
    try {
      const todayIso = toIsoDate(new Date())
      if (date > todayIso) {
        toast.error(t('validation.dateNotFuture'))
        return
      }
      await createTransaction({
        account_id: accountId,
        transaction_type: 'withdraw',
        amount: amt,
        transaction_date: date,
        months: m,
      })
      toast.success(t('toast.success'))
      setAmount('')
      setMonths('1')
      setCalc(null)
      const accRes = await listAccounts()
      setAccounts(accRes.data)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to withdraw'
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
                          onChange={(e) => {
                            setAccountId(e.target.value ? Number(e.target.value) : '')
                            setCalc(null)
                          }}
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
                      <span className="field__label">{t('form.withdrawDate')}</span>
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
                          onChange={(e) => {
                            setAmount(e.target.value)
                            setCalc(null)
                          }}
                          placeholder={t('form.amountPlaceholder')}
                        />
                      </div>
                    </label>

                    <label className="field">
                      <span className="field__label">{t('form.months')}</span>
                      <div className="field__control">
                        <Input
                          type="number"
                          min={1}
                          step={1}
                          value={months}
                          onChange={(e) => {
                            setMonths(e.target.value)
                            setCalc(null)
                          }}
                          placeholder={t('form.monthsPlaceholder')}
                        />
                      </div>
                    </label>

                    <Button type="button" className="mt-2 w-full" onClick={onCalculate} disabled={isSubmitting}>
                      {t('form.calculate')}
                    </Button>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#b89ed1] bg-white p-5 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
                <h2 className="mb-4 text-sm font-bold text-slate-950">{t('result.title')}</h2>

                {!calc ? (
                  <div className="py-10 text-sm text-slate-500">{t('result.empty')}</div>
                ) : (
                  <>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-slate-600">{t('result.startingBalance')}</div>
                        <div className="font-semibold text-slate-950">{formatRupiahCompact(calc.startingBalance)}</div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-slate-600">{t('result.monthlyReturn')}</div>
                        <div className="font-semibold text-slate-950">
                          {formatPercent(calc.monthlyReturnPercent, 4)} ({formatPercent(yearlyReturn ?? 0, 2)} / 12)
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-slate-600">{t('result.months')}</div>
                        <div className="font-semibold text-slate-950">{calc.months}</div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-slate-600">{t('result.returnAmount')}</div>
                        <div className="font-semibold text-slate-950">{formatRupiahCompact(calc.returnAmount)}</div>
                      </div>

                      <div className="mt-2 rounded-xl border border-[#d8cbe6] bg-[#f4edfb] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-bold text-[#4a1f6c]">{t('result.endingBalance')}</div>
                          <div className="text-sm font-extrabold text-slate-950">{formatRupiahCompact(calc.endingBalance)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-[#d8cbe6] bg-[#f4edfb] px-4 py-3 text-xs font-semibold text-[#4a1f6c]">
                      {t('result.formula')}
                    </div>

                    <Button
                      type="button"
                      className="mt-5 w-full"
                      onClick={() => void onConfirmWithdraw()}
                      disabled={isSubmitting || calc.endingBalance < 0}
                    >
                      {isSubmitting ? t('result.submitting') : t('result.confirm')}
                    </Button>
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

