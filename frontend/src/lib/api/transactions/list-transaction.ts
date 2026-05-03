import axios from 'axios'

import type { ListResponse, Transaction } from '@/lib/api/types/transaction/transaction'

export async function listTransactions(payload?: { account_id?: number }): Promise<ListResponse<Transaction>> {
  try {
    const response = await axios.post<ListResponse<Transaction>>('/api/transactions/list', payload ?? {})
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to list transactions')
  }
}

