import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { deleteAccount } from '@/lib/api/accounts/delete-account'
import { type Account } from '@/lib/api/types/account/account'
import { useTranslation, Trans } from 'react-i18next'
import { toast } from 'sonner'

interface DeleteAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: Account | null
  onDeleted: () => Promise<void>
}

export function DeleteAccountDialog({ open, onOpenChange, account, onDeleted }: Readonly<DeleteAccountDialogProps>) {
  const { t } = useTranslation('accounts')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const onDelete = async () => {
    if (!account) return

    setIsSubmitting(true)
    setError('')

    try {
      await deleteAccount(account.id)
      toast.success(t('toast.deleteSuccess'))
      await onDeleted()
      onOpenChange(false)
    } catch (deleteError) {
      const errMsg = deleteError instanceof Error ? deleteError.message : 'Failed to delete account'
      setError(errMsg)
      toast.error(t('toast.deleteError') + ': ' + errMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setError('')
      setIsSubmitting(false)
    }
  }, [open])

  if (!open || !account) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-950">{t('delete.title')}</h2>
          <p className="text-sm text-slate-600">
            <Trans i18nKey="delete.confirm" ns="accounts" values={{ id: account.account_id }}>
              Are you sure you want to delete account <span className="font-semibold text-slate-950">{{id: account.account_id}}</span>?
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
