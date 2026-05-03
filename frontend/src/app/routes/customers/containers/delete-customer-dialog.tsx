import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { deleteCustomer, type Customer } from '@/lib/api/customers/customer'

interface DeleteCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onDeleted: () => Promise<void> | void
}

export function DeleteCustomerDialog({ open, onOpenChange, customer, onDeleted }: Readonly<DeleteCustomerDialogProps>) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onDelete = async () => {
    if (!customer) return

    setIsSubmitting(true)
    setError('')

    try {
      await deleteCustomer(customer.id)
      await onDeleted()
      onOpenChange(false)
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete customer')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open || !customer) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-950">Delete Customer</h2>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete <span className="font-semibold text-slate-950">{customer.name}</span>?
          </p>
        </div>

        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" className="bg-slate-200 text-slate-900 shadow-none hover:bg-slate-300" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="bg-red-600 shadow-none hover:bg-red-700" onClick={() => void onDelete()} disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}