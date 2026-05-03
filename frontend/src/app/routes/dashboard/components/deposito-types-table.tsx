import type { DashboardDepositoType } from '../lib/dashboard-data'

type DepositoTypesTableProps = {
  depositoTypes: DashboardDepositoType[]
}

export function DepositoTypesTable({ depositoTypes }: Readonly<DepositoTypesTableProps>) {
  return (
    <section className="rounded-2xl border border-[#b89ed1] bg-white p-4 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-950">Deposito Types</h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#b89ed1]">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#f0e9f7] text-slate-900">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Yearly Return</th>
            </tr>
          </thead>
          <tbody>
            {depositoTypes.map((item) => (
              <tr key={item.name} className="border-t border-[#e8daef] text-slate-700">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3 font-semibold">{item.yearlyReturn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}