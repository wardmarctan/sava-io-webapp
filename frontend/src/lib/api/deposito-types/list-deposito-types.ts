import axios from 'axios'

import type { DepositoType, ListResponse } from '@/lib/api/types/deposito-type/deposito-type'

export async function listDepositoTypes(): Promise<ListResponse<DepositoType>> {
  try {
    const response = await axios.get<ListResponse<DepositoType>>('/api/deposito-types')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to list deposito types')
  }
}

export type { DepositoType, ListResponse } from '@/lib/api/types/deposito-type/deposito-type'
