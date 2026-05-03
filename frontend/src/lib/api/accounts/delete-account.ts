import axios from 'axios';

export async function deleteAccount(id: number): Promise<void> {
  try {
    await axios.post('/api/accounts/delete', { id });
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to delete account');
  }
}
