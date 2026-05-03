import type { Customer } from '../types/customer/customer';
import axios from 'axios';

export async function getCustomer(id: number): Promise<Customer> {
  try {
    const response = await axios.post<Customer>('/api/customers/get', { id });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to get customer');
  }
}