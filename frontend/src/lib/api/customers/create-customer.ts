import type { Customer } from '../types/customer/customer';
import axios from 'axios';

export type createCustomerDto = {
  name: string;
}

export async function createCustomer(createCustomerDto: createCustomerDto): Promise<Customer> {
  try {
    const response = await axios.post<Customer>('/api/customers/create', createCustomerDto);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to create customer');
  }
}