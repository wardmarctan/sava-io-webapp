export interface DepositoType {
  id: number
  name: string
  yearly_return: number
}

export interface ListResponse<T> {
  data: T[]
  total: number
}
