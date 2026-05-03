import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { DashboardSidebar } from '../dashboard/components/dashboard-sidebar'
import { DashboardTopbar } from '../dashboard/components/dashboard-topbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { listCustomers, type Customer } from '@/lib/api/customers/customer'
import { CustomerDetailScreen } from './containers/customer-detail-screen'
import { DeleteCustomerDialog } from './containers/delete-customer-dialog'

const PAGE_SIZE = 10

export function CustomersPage() {
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

  const loadCustomers = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await listCustomers()
      setCustomers(response.data)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadCustomers()
  }, [])

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

  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedCustomers = filteredCustomers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const tableBody = loading ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
        Loading customers...
      </td>
    </tr>
  ) : pagedCustomers.length === 0 ? (
    <tr>
      <td className="px-4 py-8 text-center text-slate-500" colSpan={3}>
        No customers found.
      </td>
    </tr>
  ) : (
    pagedCustomers.map((customer) => (
      <tr key={customer.id} className="border-t border-[#b89ed1]/70">
        <td className="px-4 py-3">CUS-{String(customer.id).padStart(3, '0')}</td>
        <td className="px-4 py-3">{customer.name}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3 text-slate-700">
            <button type="button" onClick={() => void openEditModal(customer.id)} title="Edit">
              <Pencil size={16} />
            </button>
            <button type="button" onClick={() => openDeleteDialog(customer)} title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </td>
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
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">Customers</h1>
                <p className="mt-1 text-sm text-slate-700">Manage customer data</p>
              </div>

              <Button onClick={openCreateModal} className="rounded-xl px-5">
                <Plus size={18} />
                Add Customer
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
                      placeholder="Search by name or ID"
                    />
                  </div>
                </label>

                <div className="text-sm text-slate-500">
                  {filteredCustomers.length} result{filteredCustomers.length === 1 ? '' : 's'}
                </div>
              </div>

              {error && <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

              <div className="overflow-hidden rounded-2xl border border-[#b89ed1]">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-[#efe7f7] text-slate-950">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Customer ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>{tableBody}</tbody>
                </table>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                <div>
                  Showing {pagedCustomers.length} of {filteredCustomers.length} customer{filteredCustomers.length === 1 ? '' : 's'}
                </div>

                <div className="flex items-center gap-4">
                  <span>
                    Page {safePage} of {Math.max(1, totalPages)}
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