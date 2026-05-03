import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createDepositoType } from '@/lib/api/deposito-types/create-deposito-type'
import { getDepositoType } from '@/lib/api/deposito-types/get-deposito-type'
import { updateDepositoType } from '@/lib/api/deposito-types/update-deposito-type'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface DepositoTypeDetailScreenProps {
  open: boolean
  type: 'create' | 'edit'
  depositoTypeId: number | null
  onOpenChange: (open: boolean) => void
  onSaved: () => Promise<void>
}

export function DepositoTypeDetailScreen({
  open,
  type,
  depositoTypeId,
  onOpenChange,
  onSaved,
}: Readonly<DepositoTypeDetailScreenProps>) {
  const { t } = useTranslation('depositoTypes')
  const [name, setName] = useState('')
  const [yearlyReturn, setYearlyReturn] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      if (!open) {
        setName('')
        setYearlyReturn('')
        setError('')
        setIsLoading(false)
        return
      }

      if (type !== 'edit' || depositoTypeId === null) {
        setName('')
        setYearlyReturn('')
        setError('')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const detail = await getDepositoType(depositoTypeId)
        if (!isMounted) return
        setName(detail.name)
        const y = detail.yearly_return
        setYearlyReturn(Number.isInteger(y) ? String(y) : String(y))
      } catch (loadError) {
        if (!isMounted) return
        const errMsg = loadError instanceof Error ? loadError.message : 'Failed to load deposito type'
        setError(errMsg)
        toast.error(errMsg)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [depositoTypeId, open, type])

  const onSubmit = async () => {
    const trimmedName = name.trim()
    const parsedReturn = Number(yearlyReturn)
    if (!trimmedName || yearlyReturn === '' || Number.isNaN(parsedReturn)) {
      setError(t('detail.validationRequired'))
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (type === 'edit' && depositoTypeId !== null) {
        await updateDepositoType(depositoTypeId, { name: trimmedName, yearly_return: parsedReturn })
        toast.success(t('toast.updateSuccess'))
      } else {
        await createDepositoType({ name: trimmedName, yearly_return: parsedReturn })
        toast.success(t('toast.createSuccess'))
      }

      await onSaved()
      onOpenChange(false)
      setName('')
      setYearlyReturn('')
    } catch (saveError) {
      const errMsg = saveError instanceof Error ? saveError.message : 'Failed to save deposito type'
      setError(errMsg)
      toast.error(type === 'edit' ? t('toast.updateError') : t('toast.createError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">{type === 'create' ? t('detail.addTitle') : t('detail.editTitle')}</h2>
            <p className="mt-1 text-sm text-slate-600">{type === 'create' ? t('detail.addSubtitle') : t('detail.editSubtitle')}</p>
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-slate-500">{t('detail.loading')}</div>
        ) : (
          <div className="space-y-4">
            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <label htmlFor="dt-name" className="field">
              <span className="field__label">{t('detail.nameLabel')}</span>
              <div className="field__control">
                <Input id="dt-name" value={name} onChange={(event) => setName(event.target.value)} placeholder={t('detail.namePlaceholder')} />
              </div>
            </label>

            <label htmlFor="dt-yearly" className="field">
              <span className="field__label">{t('detail.yearlyReturnLabel')}</span>
              <div className="field__control">
                <Input
                  id="dt-yearly"
                  type="number"
                  step="0.01"
                  value={yearlyReturn}
                  onChange={(event) => setYearlyReturn(event.target.value)}
                  placeholder={t('detail.yearlyReturnPlaceholder')}
                />
              </div>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" className="bg-slate-200 text-slate-900 shadow-none hover:bg-slate-300" onClick={() => onOpenChange(false)}>
                {t('detail.cancel')}
              </Button>
              <Button type="button" onClick={() => void onSubmit()} disabled={isSubmitting}>
                {isSubmitting ? t('detail.saving') : type === 'create' ? t('detail.submitCreate') : t('detail.submitEdit')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
