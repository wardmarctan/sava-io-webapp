export interface Account {
  id: number
  account_id: string
  customer: string
  customer_id: number
  deposito_type: string
  deposito_type_id: number
  created_at: string
  updated_at: string
  balance: string
  balance_raw: number
}

export interface ListResponse<T> {
  data: T[]
  total: number
}
