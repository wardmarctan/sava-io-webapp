import type { DashboardAccount } from '../lib/dashboard-data'

type AccountsTableProps = {
  accounts: DashboardAccount[]
  onViewAll: () => void
}

export function AccountsTable({ accounts, onViewAll }: Readonly<AccountsTableProps>) {
  return (
    <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Accounts</h2>
        <button
          type="button"
          onClick={onViewAll}
          className="cursor-pointer rounded-full border border-[#4a1f6c] bg-[#4a1f6c] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(74,31,108,0.24)] transition-transform hover:-translate-y-0.5"
          style={{ color: '#fff', backgroundColor: '#4a1f6c' }}
        >
          View All Accounts
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#b89ed1]">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#f0e9f7] text-slate-900">
            <tr>
              <th className="px-4 py-3 font-semibold">Account ID</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Deposito Type</th>
              <th className="px-4 py-3 font-semibold">Opening Date</th>
              <th className="px-4 py-3 font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.accountId} className="border-t border-[#e8daef] text-slate-700">
                <td className="px-4 py-3 font-semibold text-slate-950">{account.accountId}</td>
                <td className="px-4 py-3">{account.customer}</td>
                <td className="px-4 py-3">{account.depositoType}</td>
                <td className="px-4 py-3">{account.openingDate}</td>
                <td className="px-4 py-3 font-semibold">{account.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}