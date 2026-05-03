import { useEffect, useMemo, useState } from 'react'

import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'

import { DashboardSidebar } from '../dashboard/components/dashboard-sidebar'
import { DashboardTopbar } from '../dashboard/components/dashboard-topbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listDepositoTypes } from '@/lib/api/deposito-types/list-deposito-types'
import type { DepositoType } from '@/lib/api/types/deposito-type/deposito-type'
import { DeleteDepositoTypeDialog } from './containers/delete-deposito-type-dialog'
import { DepositoTypeDetailScreen } from './containers/deposito-type-detail-screen'
import { useDepositoTypeTableColumns } from './containers/deposito-types-table-columns'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'

export function DepositoTypesPage() {
  const { t } = useTranslation('depositoTypes')
  const [searchParams, setSearchParams] = useSearchParams()
  const [pageSize, setPageSize] = useState(10)
  const [rows, setRows] = useState<DepositoType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailType, setDetailType] = useState<'create' | 'edit'>('create')
  const [detailId, setDetailId] = useState<number | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteRow, setDeleteRow] = useState<DepositoType | null>(null)
  const [deleteLabel, setDeleteLabel] = useState('')

  const columns = useDepositoTypeTableColumns((id) => void openEditModal(id), (row) => openDeleteDialog(row))

  const loadRows = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await listDepositoTypes()
      setRows(response.data)
    } catch (loadError) {
      const errMsg = loadError instanceof Error ? loadError.message : 'Failed to load deposito types'
      setError(errMsg)
      toast.error(`${t('toast.listError')}: ${errMsg}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadRows()
  }, [])

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setDetailType('create')
      setDetailId(null)
      setDetailOpen(true)

      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('action')
      setSearchParams(nextParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    setPage(1)
  }, [query])

  const filteredRows = useMemo(() => {
    const lowered = query.trim().toLowerCase()
    if (!lowered) {
      return rows
    }

    return rows.filter((item) => {
      const padded = String(item.id).padStart(3, '0')
      const pseudoId = `dep-${padded}`
      return item.name.toLowerCase().includes(lowered) || pseudoId.includes(lowered)
    })
  }, [rows, query])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pagedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const tableBody = loading ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
        {t('loading')}
      </td>
    </tr>
  ) : pagedRows.length === 0 ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
        {t('noRows')}
      </td>
    </tr>
  ) : (
    pagedRows.map((row) => (
      <tr key={row.id} className="border-t border-[#b89ed1]/70">
        {columns.map((col, idx) => (
          <td key={idx} className="px-4 py-3">
            {col.cell(row)}
          </td>
        ))}
      </tr>
    ))
  )

  const openCreateModal = () => {
    setDetailType('create')
    setDetailId(null)
    setDetailOpen(true)
  }

  const openEditModal = (id: number) => {
    setDetailType('edit')
    setDetailId(id)
    setDetailOpen(true)
  }

  const openDeleteDialog = (row: DepositoType) => {
    const displayId = t('formatTypeId', { id: String(row.id).padStart(3, '0') })
    setDeleteLabel(`${displayId} — ${row.name}`)
    setDeleteRow(row)
    setDeleteOpen(true)
  }

  const handleSaved = async () => {
    await loadRows()
  }

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

              <Button onClick={openCreateModal}>
                <Plus size={18} />
                {t('addDepositoType')}
              </Button>
            </section>

            <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <label htmlFor="deposito-type-search" className="field m-0 max-w-sm flex-1">
                  <span className="sr-only">Search</span>
                  <div className="field__control">
                    <Search size={18} />
                    <Input
                      id="deposito-type-search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('searchPlaceholder')}
                    />
                  </div>
                </label>

                <div className="text-sm text-slate-500">
                  {filteredRows.length} {filteredRows.length === 1 ? t('results') : t('resultsPlural')}
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
                  {t('showing')} {pagedRows.length} {t('of')} {filteredRows.length}{' '}
                  {filteredRows.length === 1 ? t('singular') : t('plural')}
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

      <DepositoTypeDetailScreen
        open={detailOpen}
        type={detailType}
        depositoTypeId={detailId}
        onOpenChange={setDetailOpen}
        onSaved={handleSaved}
      />

      <DeleteDepositoTypeDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        depositoType={deleteRow}
        label={deleteLabel}
        onDeleted={handleSaved}
      />
    </main>
  )
}
