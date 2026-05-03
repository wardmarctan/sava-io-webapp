import { CircleUserRound, WalletCards, Tags } from 'lucide-react'

const iconMap = {
  customer: CircleUserRound,
  account: WalletCards,
  tag: Tags,
} as const

type SummaryCardProps = {
  label: string
  value: string
  icon: keyof typeof iconMap
}

export function SummaryCard({ label, value, icon }: Readonly<SummaryCardProps>) {
  const Icon = iconMap[icon]

  return (
    <article className="flex min-h-[76px] items-center gap-3 rounded-2xl border border-[#b89ed1] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(62,23,86,0.06)]">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f3ecfb] text-[#4a1f6c]">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[0.72rem] font-medium text-slate-800">{label}</p>
        <p className="text-lg font-extrabold tracking-tight text-slate-950">{value}</p>
      </div>
    </article>
  )
}