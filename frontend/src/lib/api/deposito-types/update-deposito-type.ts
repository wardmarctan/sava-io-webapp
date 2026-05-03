import axios from 'axios'

import type { DepositoType } from '@/lib/api/types/deposito-type/deposito-type'

export type UpdateDepositoTypeDto = {
  name: string
  yearly_return: number
}

export async function updateDepositoType(id: number, data: UpdateDepositoTypeDto): Promise<DepositoType> {
  try {
    const response = await axios.post<DepositoType>('/api/deposito-types/update', { id, ...data })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to update deposito type')
  }
}
