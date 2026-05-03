import { type Account } from '../types/account/account'

// Mocking initial data based on the provided image
let mockedAccounts: Account[] = [
  { id: 1, accountId: 'ACC-001', customer: 'Budi Santoso', depositoType: 'Deposito Gold', openingDate: '30 Apr 2026', balance: 'Rp 160.000.000' },
  { id: 2, accountId: 'ACC-002', customer: 'Siti Aminah', depositoType: 'Deposito Silver', openingDate: '30 Apr 2026', balance: 'Rp 140.000.000' },
  { id: 3, accountId: 'ACC-003', customer: 'Jane Doe', depositoType: 'Deposito Bronze', openingDate: '30 Apr 2026', balance: 'Rp 160.000.000' },
  { id: 4, accountId: 'ACC-004', customer: 'Dewi Lestari', depositoType: 'Deposito Gold', openingDate: '30 Apr 2026', balance: 'Rp 140.000.000' },
  { id: 5, accountId: 'ACC-005', customer: 'John Doe', depositoType: 'Deposito Bronze', openingDate: '30 Apr 2026', balance: 'Rp 160.000.000' },
  { id: 6, accountId: 'ACC-006', customer: 'Effendy', depositoType: 'Deposito Gold', openingDate: '30 Apr 2026', balance: 'Rp 140.000.000' },
  { id: 7, accountId: 'ACC-007', customer: 'Asep', depositoType: 'Deposito Silver', openingDate: '30 Apr 2026', balance: 'Rp 160.000.000' },
  { id: 8, accountId: 'ACC-008', customer: 'Bang Gor', depositoType: 'Deposito Bronze', openingDate: '30 Apr 2026', balance: 'Rp 140.000.000' },
  { id: 9, accountId: 'ACC-009', customer: 'Patrick Star', depositoType: 'Deposito Gold', openingDate: '30 Apr 2026', balance: 'Rp 160.000.000' },
  { id: 10, accountId: 'ACC-010', customer: 'Spongebob', depositoType: 'Deposito Bronze', openingDate: '30 Apr 2026', balance: 'Rp 140.000.000' },
]

export const getMockedAccounts = () => mockedAccounts
export const setMockedAccounts = (accounts: Account[]) => { mockedAccounts = accounts }

export async function listAccounts() {
  // Simulate API delay
  return new Promise<{ data: Account[] }>((resolve) => {
    setTimeout(() => {
      resolve({ data: [...mockedAccounts] })
    }, 500)
  })
}
