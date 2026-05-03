import type { Account } from '../types/account/account';
import axios from 'axios';

export async function getAccount(id: number): Promise<Account> {
  try {
    const response = await axios.post<Account>('/api/accounts/get', { id });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to get account');
  }
}
