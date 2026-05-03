import { useEffect, useMemo, useState } from 'react'

import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react'

import { DashboardSidebar } from '../dashboard/components/dashboard-sidebar'
import { DashboardTopbar } from '../dashboard/components/dashboard-topbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listAccounts } from '@/lib/api/accounts/list-account'
import type { Account } from '@/lib/api/types/account/account'
import { listTransactions } from '@/lib/api/transactions/list-transaction'
import type { Transaction } from '@/lib/api/types/transaction/transaction'
import { useTransactionTableColumns } from './containers/transaction-table-columns'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export function TransactionHistoryPage() {
  const { t } = useTranslation('transactionHistory')
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const [filterOpen, setFilterOpen] = useState(false)
  const [filterAccountId, setFilterAccountId] = useState<number | ''>('')
  const [appliedAccountId, setAppliedAccountId] = useState<number | null>(null)

  const columns = useTransactionTableColumns()

  const load = async (accountId?: number | null) => {
    setLoading(true)
    setError('')
    try {
      const [txRes, accRes] = await Promise.all([
        listTransactions(accountId ? { account_id: accountId } : undefined),
        listAccounts(),
      ])
      setRows(txRes.data)
      setAccounts(accRes.data)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load transactions'
      setError(msg)
      toast.error(`${t('toast.listError')}: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load(null)
  }, [])

  useEffect(() => {
    setPage(1)
  }, [query])

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase()
    if (!lowered) return rows

    return rows.filter((r) => {
      return (
        r.account_id.toLowerCase().includes(lowered) ||
        r.customer.toLowerCase().includes(lowered)
      )
    })
  }, [rows, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const tableBody = loading ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
        {t('loading')}
      </td>
    </tr>
  ) : paged.length === 0 ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
        {t('noRows')}
      </td>
    </tr>
  ) : (
    paged.map((row) => (
      <tr key={row.id} className="border-t border-[#b89ed1]/70">
        {columns.map((col, idx) => (
          <td key={idx} className="px-4 py-3">
            {col.cell(row)}
          </td>
        ))}
      </tr>
    ))
  )

  const applyFilter = async () => {
    const next = filterAccountId === '' ? null : filterAccountId
    setAppliedAccountId(next)
    setFilterOpen(false)
    await load(next)
  }

  const resetFilter = async () => {
    setAppliedAccountId(null)
    setFilterAccountId('')
    setFilterOpen(false)
    await load(null)
  }

  const dropdownLabel = (acc: Account) => `${acc.account_id} - ${acc.customer} (${acc.deposito_type})`

  return (
    <main className="min-h-screen bg-[#f7f3fb] text-slate-950">
      <div className="flex min-h-screen">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />

          <div className="min-w-0 flex-1 overflow-auto px-6 py-6 lg:px-8">
            <section className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">{t('title')}</h1>
                <p className="mt-1 text-sm text-slate-700">{t('subtitle')}</p>
              </div>

              <div className="relative flex items-center gap-2">
                {appliedAccountId != null && (
                  <Button
                    type="button"
                    className="bg-slate-200 text-slate-900 shadow-none hover:bg-slate-300"
                    onClick={() => void resetFilter()}
                  >
                    {t('filter.reset')}
                  </Button>
                )}

                <Button type="button" onClick={() => setFilterOpen((v) => !v)} className="px-5">
                  <Filter size={18} />
                  {t('filter.button')}
                </Button>

                {filterOpen && (
                  <div className="absolute right-0 top-12 z-20 w-[360px] rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_10px_30px_rgba(62,23,86,0.14)]">
                    <div className="text-sm font-bold text-slate-950">{t('filter.title')}</div>
                    <div className="mt-3 space-y-3">
                      <label className="field">
                        <span className="field__label">{t('filter.account')}</span>
                        <div className="field__control">
                          <select
                            value={filterAccountId}
                            onChange={(e) => setFilterAccountId(e.target.value ? Number(e.target.value) : '')}
                            className="flex h-11 w-full rounded-xl border border-[#d8cbe6] bg-[#f9f6fc] px-4 text-sm text-slate-900 transition-colors focus:border-[#4a1f6c] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4a1f6c]"
                          >
                            <option value="">{t('filter.allAccounts')}</option>
                            {accounts.map((acc) => (
                              <option key={acc.id} value={acc.id}>
                                {dropdownLabel(acc)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </label>

                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          className="bg-slate-200 text-slate-900 shadow-none hover:bg-slate-300"
                          onClick={() => setFilterOpen(false)}
                        >
                          {t('filter.cancel')}
                        </Button>
                        <Button type="button" onClick={() => void applyFilter()}>
                          {t('filter.apply')}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <label htmlFor="tx-search" className="field m-0 max-w-sm flex-1">
                  <span className="sr-only">Search</span>
                  <div className="field__control">
                    <Search size={18} />
                    <Input
                      id="tx-search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('searchPlaceholder')}
                    />
                  </div>
                </label>

                <div className="text-sm text-slate-500">
                  {filtered.length} {filtered.length === 1 ? t('results') : t('resultsPlural')}
                </div>
              </div>

              {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <div className="overflow-hidden rounded-2xl border border-[#b89ed1]">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#efe7f7] text-slate-950">
                    <tr>
                      {columns.map((col, idx) => (
                        <th key={idx} className="px-4 py-3 text-left font-semibold">
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{tableBody}</tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                <div>
                  {t('showing')} {paged.length} {t('of')} {filtered.length}
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span>{t('rowsPerPage')}</span>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setPage(1)
                      }}
                      className="rounded-md border border-[#d8cbe6] bg-[#efe7f7] px-2 py-1 text-sm outline-none focus:border-[#b89ed1]"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <span>
                      {t('page')} {safePage} {t('of')} {Math.max(1, totalPages)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={safePage <= 1}
                        className="rounded-lg border border-[#b89ed1] px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        disabled={safePage >= totalPages}
                        className="rounded-lg border border-[#b89ed1] px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

