import axios from 'axios'

import type { Transaction, TransactionType } from '@/lib/api/types/transaction/transaction'

export type CreateTransactionDto = {
  account_id: number
  transaction_type: TransactionType
  amount: number
  transaction_date: string // YYYY-MM-DD
  months?: number
}

export async function createTransaction(payload: CreateTransactionDto): Promise<Transaction> {
  try {
    const response = await axios.post<Transaction>('/api/transactions/create', payload)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to create transaction')
  }
}

