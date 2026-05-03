export type DashboardAccount = {
  accountId: string
  customer: string
  depositoType: string
  openingDate: string
  balance: string
}

export type DashboardDepositoType = {
  name: string
  yearlyReturn: string
}

export type DashboardTransaction = {
  date: string
  accountId: string
  customer: string
  type: string
  amount: string
  balanceAfter: string
}

export const dashboardSummary = [
  { label: 'Total Customers', value: '12', icon: 'customer' },
  { label: 'Total Accounts', value: '18', icon: 'account' },
  { label: 'Deposito Types', value: '3', icon: 'tag' },
  { label: 'Total Balance', value: 'Rp 185.000.000', icon: 'money' },
] as const

export const dashboardAccounts: DashboardAccount[] = [
  { accountId: 'ACC-001', customer: 'Budi Santoso', depositoType: 'Deposito Gold', openingDate: '30 Apr 2026', balance: 'Rp 150.000.000' },
  { accountId: 'ACC-002', customer: 'Siti Aminah', depositoType: 'Deposito Silver', openingDate: '15 Feb 2026', balance: 'Rp 75.000.000' },
  { accountId: 'ACC-003', customer: 'Jane Doe', depositoType: 'Deposito Bronze', openingDate: '19 Mar 2025', balance: 'Rp 55.000.000' },
  { accountId: 'ACC-004', customer: 'Dewi Lestari', depositoType: 'Deposito Gold', openingDate: '18 Aug 2025', balance: 'Rp 30.000.000' },
  { accountId: 'ACC-005', customer: 'John Doe', depositoType: 'Deposito Silver', openingDate: '17 Jan 2026', balance: 'Rp 715.000.000' },
]

export const dashboardDepositoTypes: DashboardDepositoType[] = [
  { name: 'Deposito Bronze', yearlyReturn: '3%' },
  { name: 'Deposito Silver', yearlyReturn: '5%' },
  { name: 'Deposito Gold', yearlyReturn: '7%' },
]

export const dashboardTransactions: DashboardTransaction[] = [
  { date: '30 Apr 2026 10:15', accountId: 'ACC-001', customer: 'Budi Santoso', type: 'Withdraw', amount: 'Rp 10.000.000', balanceAfter: 'Rp 150.000.000' },
  { date: '30 Apr 2026 10:15', accountId: 'ACC-002', customer: 'Siti Aminah', type: 'Deposit', amount: 'Rp 5.000.000', balanceAfter: 'Rp 75.000.000' },
  { date: '30 Apr 2026 10:14', accountId: 'ACC-003', customer: 'Jane Doe', type: 'Deposit', amount: 'Rp 3.000.000', balanceAfter: 'Rp 50.000.000' },
  { date: '30 Apr 2026 10:13', accountId: 'ACC-004', customer: 'Dewi Lestari', type: 'Withdraw', amount: 'Rp 15.000.000', balanceAfter: 'Rp 190.771.000' },
  { date: '30 Apr 2026 10:12', accountId: 'ACC-005', customer: 'John Doe', type: 'Withdraw', amount: 'Rp 20.000.000', balanceAfter: 'Rp 120.000.000' },
]