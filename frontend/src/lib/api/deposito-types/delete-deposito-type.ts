import axios from 'axios'

export async function deleteDepositoType(id: number): Promise<void> {
  try {
    await axios.post('/api/deposito-types/delete', { id })
  } catch (error: any) {
    throw new Error(error.response?.data?.message ?? 'Failed to delete deposito type')
  }
}
