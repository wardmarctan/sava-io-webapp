import type { Account } from '../types/account/account';
import axios from 'axios';

export async function updateAccount(id: number, data: { customer_id: number; deposito_type_id: number; balance: number }): Promise<Account> {
  try {
    const response = await axios.post<Account>('/api/accounts/update', { id, ...data });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to update account');
  }
}
