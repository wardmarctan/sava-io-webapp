import axios from 'axios'

import type { DepositoType } from '@/lib/api/types/deposito-type/deposito-type'

export async function getDepositoType(id: number): Promise<DepositoType> {
  try {
    const response = await axios.post<DepositoType>('/api/deposito-types/get', { id })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to get deposito type')
  }
}
