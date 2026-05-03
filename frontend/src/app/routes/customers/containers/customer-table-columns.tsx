import { Pencil, Trash2 } from 'lucide-react'
import type { Customer } from '@/lib/api/types/customer/customer'
import { useTranslation } from 'react-i18next'

export interface CustomerColumnDef {
  header: string
  cell: (customer: Customer) => React.ReactNode
}

export function useCustomerTableColumns(
  onEdit: (customerId: number) => void,
  onDelete: (customer: Customer) => void
): CustomerColumnDef[] {
  const { t } = useTranslation('customers')

  return [
    {
      header: t('header.customerId'),
      cell: (customer) => `CUS-${String(customer.id).padStart(3, '0')}`,
    },
    {
      header: t('header.name'),
      cell: (customer) => customer.name,
    },
    {
      header: t('header.actions'),
      cell: (customer) => (
        <div className="flex items-center gap-3 text-slate-700">
          <button type="button" onClick={() => onEdit(customer.id)} title="Edit">
            <Pencil size={16} />
          </button>
          <button type="button" onClick={() => onDelete(customer)} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]
}
