export function formatPercent(value: number, maxFractionDigits = 4): string {
  if (!Number.isFinite(value)) return '-'
  if (Number.isInteger(value)) return `${value}%`
  const rounded = Number(value.toFixed(maxFractionDigits))
  const text = rounded % 1 === 0 ? String(Math.trunc(rounded)) : rounded.toFixed(maxFractionDigits).replace(/0+$/, '').replace(/\.$/, '')
  return `${text}%`
}

export function formatRupiahCompact(value: number): string {
  if (!Number.isFinite(value)) return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

