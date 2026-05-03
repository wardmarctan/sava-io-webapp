export type TransactionType = 'deposit' | 'withdraw'

export interface Transaction {
  id: number
  account_id: string
  account_id_raw: number
  customer: string
  deposito_type: string
  transaction_type: TransactionType
  amount: string
  amount_raw: number
  transaction_date: string
  starting_balance: string
  starting_balance_raw: number
  ending_balance: string
  ending_balance_raw: number
  yearly_return: number
  monthly_return: number
  return_amount?: string | null
  return_amount_raw?: number | null
  months?: number | null
}

export interface ListResponse<T> {
  data: T[]
  total: number
}

