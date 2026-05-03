import axios from 'axios'

import type { DepositoType } from '@/lib/api/types/deposito-type/deposito-type'

export type CreateDepositoTypeDto = {
  name: string
  yearly_return: number
}

export async function createDepositoType(data: CreateDepositoTypeDto): Promise<DepositoType> {
  try {
    const response = await axios.post<DepositoType>('/api/deposito-types/create', data)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to create deposito type')
  }
}
