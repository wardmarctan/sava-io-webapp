import { Pencil, Trash2 } from 'lucide-react'
import type { Account } from '@/lib/api/types/account/account'
import { useTranslation } from 'react-i18next'

export interface AccountColumnDef {
  header: string
  cell: (account: Account) => React.ReactNode
}

export function useAccountTableColumns(
  onEdit: (accountId: number) => void,
  onDelete: (account: Account) => void
): AccountColumnDef[] {
  const { t } = useTranslation('accounts')

  return [
    {
      header: t('header.accountId'),
      cell: (account) => account.account_id,
    },
    {
      header: t('header.customer'),
      cell: (account) => account.customer,
    },
    {
      header: t('header.depositoType'),
      cell: (account) => account.deposito_type,
    },
    {
      header: t('header.createdAt'),
      cell: (account) => account.created_at,
    },
    {
      header: t('header.updatedAt'),
      cell: (account) => account.updated_at,
    },
    {
      header: t('header.balance'),
      cell: (account) => account.balance,
    },
    {
      header: t('header.actions'),
      cell: (account) => (
        <div className="flex items-center gap-3 text-slate-700">
          <button type="button" onClick={() => onEdit(account.id)} title="Edit">
            <Pencil size={16} />
          </button>
          <button type="button" onClick={() => onDelete(account)} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]
}
