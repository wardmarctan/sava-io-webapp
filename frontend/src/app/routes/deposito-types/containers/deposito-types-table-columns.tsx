import type { ReactNode } from 'react'

import { Pencil, Trash2 } from 'lucide-react'

import type { DepositoType } from '@/lib/api/types/deposito-type/deposito-type'
import { useTranslation } from 'react-i18next'

export interface DepositoTypeColumnDef {
  header: string
  cell: (row: DepositoType) => ReactNode
}

export function formatYearlyReturnPercent(value: number): string {
  if (Number.isInteger(value)) {
    return `${value}%`
  }
  const rounded = Number(value.toFixed(2))
  const text = rounded % 1 === 0 ? String(Math.round(rounded)) : rounded.toFixed(2)
  return `${text}%`
}

export function useDepositoTypeTableColumns(
  onEdit: (id: number) => void,
  onDelete: (row: DepositoType) => void,
): DepositoTypeColumnDef[] {
  const { t } = useTranslation('depositoTypes')

  return [
    {
      header: t('header.typeId'),
      cell: (row) => t('formatTypeId', { id: String(row.id).padStart(3, '0') }),
    },
    {
      header: t('header.name'),
      cell: (row) => row.name,
    },
    {
      header: t('header.yearlyReturn'),
      cell: (row) => formatYearlyReturnPercent(row.yearly_return),
    },
    {
      header: t('header.actions'),
      cell: (row) => (
        <div className="flex items-center gap-3 text-slate-700">
          <button type="button" onClick={() => onEdit(row.id)} title="Edit">
            <Pencil size={16} />
          </button>
          <button type="button" onClick={() => onDelete(row)} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ]
}
