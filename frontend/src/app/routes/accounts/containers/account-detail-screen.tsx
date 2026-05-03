import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAccount } from '@/lib/api/accounts/create-account'
import { getAccount } from '@/lib/api/accounts/get-account'
import { updateAccount } from '@/lib/api/accounts/update-account'
import { listCustomers } from '@/lib/api/customers/list-customer'
import { listDepositoTypes, type DepositoType } from '@/lib/api/deposito-types/list-deposito-types'
import { type Customer } from '@/lib/api/types/customer/customer'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface AccountDetailScreenProps {
  open: boolean
  type: 'create' | 'edit'
  accountId: number | null
  onOpenChange: (open: boolean) => void
  onSaved: () => Promise<void>
}

export function AccountDetailScreen({ open, type, accountId, onOpenChange, onSaved }: Readonly<AccountDetailScreenProps>) {
  const { t } = useTranslation('accounts')
  const [customerId, setCustomerId] = useState<number | ''>('')
  const [depositoTypeId, setDepositoTypeId] = useState<number | ''>('')
  const [balance, setBalance] = useState<string>('')
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [depositoTypes, setDepositoTypes] = useState<DepositoType[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadDetail = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [customersRes, typesRes] = await Promise.all([
          listCustomers(),
          listDepositoTypes(),
        ])
        if (!isMounted) return
        setCustomers(customersRes.data)
        setDepositoTypes(typesRes.data)

        if (type === 'edit' && accountId !== null) {
          const detail = await getAccount(accountId)
          if (!isMounted) return
          setCustomerId(detail.customer_id)
          setDepositoTypeId(detail.deposito_type_id)
          setBalance(detail.balance_raw.toString())
        } else {
          setCustomerId('')
          setDepositoTypeId('')
          setBalance('')
        }
      } catch (loadError) {
        if (!isMounted) return
        const errMsg = loadError instanceof Error ? loadError.message : 'Failed to load account detail'
        setError(errMsg)
        toast.error(errMsg)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (open) {
      void loadDetail()
    }

    return () => {
      isMounted = false
    }
  }, [open, type, accountId])

  const onSubmit = async () => {
    if (customerId === '' || depositoTypeId === '' || balance === '') {
      setError(t('detail.validationAllFieldsRequired'))
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const parsedBalance = Number(balance)
      
      if (type === 'edit' && accountId !== null) {
        await updateAccount(accountId, { customer_id: customerId, deposito_type_id: depositoTypeId, balance: parsedBalance })
        toast.success(t('toast.updateSuccess'))
      } else {
        await createAccount({ customer_id: customerId, deposito_type_id: depositoTypeId, balance: parsedBalance })
        toast.success(t('toast.createSuccess'))
      }

      await onSaved()
      onOpenChange(false)
      setCustomerId('')
      setDepositoTypeId('')
      setBalance('')
    } catch (saveError) {
      const errMsg = saveError instanceof Error ? saveError.message : 'Failed to save account'
      setError(errMsg)
      toast.error(type === 'edit' ? t('toast.updateError') : t('toast.createError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!open) return null

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
          <div className="flex items-center justify-center py-12 text-slate-500">
            {t('detail.loading')}
          </div>
        ) : (
          <div className="space-y-4">
            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <label htmlFor="customer" className="field">
                <span className="field__label">{t('detail.customerLabel')}</span>
                <div className="field__control">
                  <select 
                    id="customer" 
                    value={customerId} 
                    onChange={(e) => setCustomerId(Number(e.target.value))}
                    disabled={type === 'edit'}
                    className="select"
                  >
                    <option value="" disabled>{t('detail.selectCustomerPlaceholder')}</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label htmlFor="depositoType" className="field">
                <span className="field__label">{t('detail.depositoTypeLabel')}</span>
                <div className="field__control">
                  <select 
                    id="depositoType" 
                    value={depositoTypeId} 
                    onChange={(e) => setDepositoTypeId(Number(e.target.value))}
                    className="select"
                  >
                    <option value="" disabled>{t('detail.selectDepositoTypePlaceholder')}</option>
                    {depositoTypes.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </label>

              <label htmlFor="balance" className="field">
                <span className="field__label">{t('detail.balanceLabel')}</span>
                <div className="field__control">
                  <Input 
                    id="balance" 
                    type="number" 
                    value={balance} 
                    onChange={(e) => setBalance(e.target.value)} 
                    placeholder={t('detail.balancePlaceholder')} 
                    disabled={type === 'edit'}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </label>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" onClick={() => onOpenChange(false)}>
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
