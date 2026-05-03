import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { DashboardSidebar } from '../dashboard/components/dashboard-sidebar'
import { DashboardTopbar } from '../dashboard/components/dashboard-topbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listCustomers } from '@/lib/api/customers/list-customer'
import { type Customer } from '@/lib/api/types/customer/customer'
import { CustomerDetailScreen } from './containers/customer-detail-screen'
import { DeleteCustomerDialog } from './containers/delete-customer-dialog'
import { useCustomerTableColumns } from './containers/customer-table-columns'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'

export function CustomersPage() {
  const { t } = useTranslation('customers')
  const [searchParams, setSearchParams] = useSearchParams()
  const [pageSize, setPageSize] = useState(10)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailType, setDetailType] = useState<'create' | 'edit'>('create')
  const [detailCustomerId, setDetailCustomerId] = useState<number | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null)

  const columns = useCustomerTableColumns(
    (id) => void openEditModal(id),
    (customer) => openDeleteDialog(customer)
  )

  const loadCustomers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await listCustomers()
      setCustomers(response.data)
      // toast.success(t('toast.listSuccess')) // Optional: Might be too noisy on every load
    } catch (loadError) {
      const errMsg = loadError instanceof Error ? loadError.message : 'Failed to load customers'
      setError(errMsg)
      toast.error(t('toast.listError') + ': ' + errMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCustomers()
  }, [])

  useEffect(() => {
    if (searchParams.get('action') === 'create') {
      setDetailType('create')
      setDetailCustomerId(null)
      setDetailOpen(true)

      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('action')
      setSearchParams(nextParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    setPage(1)
  }, [query])

  const filteredCustomers = useMemo(() => {
    const lowered = query.trim().toLowerCase()
    if (!lowered) {
      return customers
    }

    return customers.filter((customer) => {
      return customer.name.toLowerCase().includes(lowered) || `cus-${String(customer.id).padStart(3, '0')}`.includes(lowered)
    })
  }, [customers, query])

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pagedCustomers = filteredCustomers.slice((safePage - 1) * pageSize, safePage * pageSize)
  const tableBody = loading ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
        {t('loading')}
      </td>
    </tr>
  ) : pagedCustomers.length === 0 ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
        {t('noCustomers')}
      </td>
    </tr>
  ) : (
    pagedCustomers.map((customer) => (
      <tr key={customer.id} className="border-t border-[#b89ed1]/70">
        {columns.map((col, idx) => (
          <td key={idx} className="px-4 py-3">
            {col.cell(customer)}
          </td>
        ))}
      </tr>
    ))
  )
  const openCreateModal = () => {
    setDetailType('create')
    setDetailCustomerId(null)
    setDetailOpen(true)
  }

  const openEditModal = async (customerId: number) => {
    setDetailType('edit')
    setDetailCustomerId(customerId)
    setDetailOpen(true)
  }

  const openDeleteDialog = (customer: Customer) => {
    setDeleteCustomer(customer)
    setDeleteOpen(true)
  }

  const handleSaved = async () => {
    await loadCustomers()
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
                {t('addCustomer')}
              </Button>
            </section>

            <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <label htmlFor="customer-search" className="field m-0 max-w-sm flex-1">
                  <span className="sr-only">Search customers</span>
                  <div className="field__control">
                    <Search size={18} />
                    <Input
                      id="customer-search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t('searchPlaceholder')}
                    />
                  </div>
                </label>

                <div className="text-sm text-slate-500">
                  {filteredCustomers.length} {filteredCustomers.length === 1 ? t('results') : t('resultsPlural')}
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
                  {t('showing')} {pagedCustomers.length} {t('of')} {filteredCustomers.length} {filteredCustomers.length === 1 ? t('customer') : t('customers')}
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

      <CustomerDetailScreen
        open={detailOpen}
        type={detailType}
        customerId={detailCustomerId}
        onOpenChange={setDetailOpen}
        onSaved={handleSaved}
      />

      <DeleteCustomerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        customer={deleteCustomer}
        onDeleted={handleSaved}
      />
    </main>
  )
}