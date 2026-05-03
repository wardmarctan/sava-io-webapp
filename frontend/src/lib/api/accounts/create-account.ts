import { getMockedAccounts, setMockedAccounts } from './list-account'

export async function createAccount(data: { customer: string; depositoType: string; balance: string }) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      const accounts = getMockedAccounts()
      const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1
      const newAccountId = `ACC-${String(newId).padStart(3, '0')}`
      
      setMockedAccounts([
        ...accounts,
        {
          id: newId,
          accountId: newAccountId,
          customer: data.customer,
          depositoType: data.depositoType,
          balance: data.balance,
          openingDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }
      ])
      resolve()
    }, 500)
  })
}
