import type { Customer } from '../types/customer/customer';
import axios from 'axios';

export type updateCustomerDto = {
  name: string;
}

export async function updateCustomer(id: number, updateCustomerDto: updateCustomerDto): Promise<Customer> {
  try {
    const response = await axios.post<Customer>('/api/customers/update', { id, ...updateCustomerDto });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to update customer');
  }
}