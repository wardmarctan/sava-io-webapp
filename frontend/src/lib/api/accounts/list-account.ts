import type { Account, ListResponse } from '../types/account/account';
import axios from 'axios';

export async function listAccounts(): Promise<ListResponse<Account>> {
  try {
    const response = await axios.post<ListResponse<Account>>('/api/accounts/list');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to list accounts');
  }
}
