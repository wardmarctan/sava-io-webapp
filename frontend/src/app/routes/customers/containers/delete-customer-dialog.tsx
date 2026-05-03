import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { deleteCustomer } from '@/lib/api/customers/delete-customer'
import { type Customer } from '@/lib/api/types/customer/customer'
import { useTranslation, Trans } from 'react-i18next'
import { toast } from 'sonner'

interface DeleteCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: Customer | null
  onDeleted: () => Promise<void> | void
}

export function DeleteCustomerDialog({ open, onOpenChange, customer, onDeleted }: Readonly<DeleteCustomerDialogProps>) {
  const { t } = useTranslation('customers')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onDelete = async () => {
    if (!customer) return

    setIsSubmitting(true)
    setError('')

    try {
      await deleteCustomer(customer.id)
      toast.success(t('toast.deleteSuccess'))
      await onDeleted()
      onOpenChange(false)
    } catch (deleteError) {
      const errMsg = deleteError instanceof Error ? deleteError.message : 'Failed to delete customer'
      setError(errMsg)
      toast.error(t('toast.deleteError') + ': ' + errMsg)
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
          <h2 className="text-2xl font-bold text-slate-950">{t('delete.title')}</h2>
          <p className="text-sm text-slate-600">
            <Trans i18nKey="delete.confirm" ns="customers" values={{ name: customer.name }}>
              Are you sure you want to delete <span className="font-semibold text-slate-950">{{name: customer.name}}</span>?
            </Trans>
          </p>
        </div>

        {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button type="button" className="bg-slate-200 text-slate-900 shadow-none hover:bg-slate-300" onClick={() => onOpenChange(false)}>
            {t('delete.cancel')}
          </Button>
          <Button type="button" className="bg-red-600 shadow-none hover:bg-red-700" onClick={() => void onDelete()} disabled={isSubmitting}>
            {isSubmitting ? t('delete.deleting') : t('delete.delete')}
          </Button>
        </div>
      </div>
    </div>
  )
}