import type { Customer, ListResponse } from '../types/customer/customer';
import axios from 'axios';

export async function listCustomers(): Promise<ListResponse<Customer>> {
  try {
    const response = await axios.post<ListResponse<Customer>>('/api/customers/list');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to list customers');
  }
}