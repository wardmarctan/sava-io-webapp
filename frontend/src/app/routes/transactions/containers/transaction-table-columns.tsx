import type { ReactNode } from 'react'

import type { Transaction } from '@/lib/api/types/transaction/transaction'
import { useTranslation } from 'react-i18next'

export interface TransactionColumnDef {
  header: string
  cell: (row: Transaction) => ReactNode
}

export function useTransactionTableColumns(): TransactionColumnDef[] {
  const { t } = useTranslation('transactionHistory')

  return [
    {
      header: t('header.date'),
      cell: (row) => row.transaction_date,
    },
    {
      header: t('header.accountId'),
      cell: (row) => <span className="font-semibold text-slate-950">{row.account_id}</span>,
    },
    {
      header: t('header.customer'),
      cell: (row) => row.customer,
    },
    {
      header: t('header.type'),
      cell: (row) => (
        <span className="rounded-full bg-[#f4edfb] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4a1f6c]">
          {row.transaction_type}
        </span>
      ),
    },
    {
      header: t('header.amount'),
      cell: (row) => <span className="font-semibold">{row.amount}</span>,
    },
    {
      header: t('header.balanceAfter'),
      cell: (row) => <span className="font-semibold">{row.ending_balance}</span>,
    },
  ]
}

