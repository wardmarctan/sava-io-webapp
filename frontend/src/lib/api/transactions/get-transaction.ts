import axios from 'axios'

import type { Transaction } from '@/lib/api/types/transaction/transaction'

export async function getTransaction(id: number): Promise<Transaction> {
  try {
    const response = await axios.post<Transaction>('/api/transactions/get', { id })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to get transaction')
  }
}

