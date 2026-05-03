import type { Account } from '@/lib/api/types/account/account'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

type AccountsTableProps = {
  accounts: Account[]
  onViewAll: () => void
}

export function AccountsTable({ accounts, onViewAll }: Readonly<AccountsTableProps>) {
  const { t } = useTranslation('dashboard')

  return (
    <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">{t('page.accounts')}</h2>
        <Button type="button" onClick={onViewAll}>
          {t('page.viewAllAccounts')}
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#b89ed1]">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#f0e9f7] text-slate-900">
            <tr>
              <th className="px-4 py-3 font-semibold">{t('accountsTable.accountId')}</th>
              <th className="px-4 py-3 font-semibold">{t('accountsTable.customer')}</th>
              <th className="px-4 py-3 font-semibold">{t('accountsTable.depositoType')}</th>
              <th className="px-4 py-3 font-semibold">{t('accountsTable.openingDate')}</th>
              <th className="px-4 py-3 font-semibold">{t('accountsTable.balance')}</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-t border-[#e8daef] text-slate-700">
                <td className="px-4 py-3 font-semibold text-slate-950">{account.account_id}</td>
                <td className="px-4 py-3">{account.customer}</td>
                <td className="px-4 py-3">{account.deposito_type}</td>
                <td className="px-4 py-3">{account.created_at}</td>
                <td className="px-4 py-3 font-semibold">{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}