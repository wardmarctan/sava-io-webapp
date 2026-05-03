import axios from 'axios';

export async function deleteCustomer(id: number): Promise<void> {
  try {
    await axios.post('/api/customers/delete', { id });
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to delete customer');
  }
}