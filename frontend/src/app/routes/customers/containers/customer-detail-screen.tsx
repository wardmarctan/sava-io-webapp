import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createCustomer, getCustomer, updateCustomer } from '@/lib/api/customers/customer'

interface CustomerDetailScreenProps {
  open: boolean
  type: 'create' | 'edit'
  customerId: number | null
  onOpenChange: (open: boolean) => void
  onSaved: () => Promise<void> | void
}

export function CustomerDetailScreen({ open, type, customerId, onOpenChange, onSaved }: Readonly<CustomerDetailScreenProps>) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadCustomerDetail = async () => {
      if (!open) {
        setName('')
        setError('')
        setIsLoading(false)
        return
      }

      if (type !== 'edit' || customerId === null) {
        setName('')
        setError('')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const detail = await getCustomer(customerId)
        if (!isMounted) return
        setName(detail.name)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : 'Failed to load customer detail')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadCustomerDetail()

    return () => {
      isMounted = false
    }
  }, [customerId, open, type])

  const onSubmit = async () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Customer name is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      if (type === 'edit' && customerId !== null) {
        await updateCustomer(customerId, { name: trimmedName })
      } else {
        await createCustomer({ name: trimmedName })
      }

      await onSaved()
      onOpenChange(false)
      setName('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save customer')
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
            <h2 className="text-2xl font-bold text-slate-950">{type === 'create' ? 'Add Customer' : 'Edit Customer'}</h2>
            <p className="mt-1 text-sm text-slate-600">Create or update customer data</p>
          </div>
          <button type="button" onClick={() => onOpenChange(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <span className="sr-only">Close</span>
            <Loader2 className="size-4 opacity-0" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-slate-500">
            <Loader2 className="mr-2 size-5 animate-spin" />
            Loading customer...
          </div>
        ) : (
          <div className="space-y-4">
            <label htmlFor="customer-name" className="field">
              <span>Customer name</span>
              <div className="field__control">
                <Input
                  id="customer-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
            </label>

            {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" className="bg-slate-200 text-slate-900 shadow-none hover:bg-slate-300" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={() => void onSubmit()} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Customer'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}