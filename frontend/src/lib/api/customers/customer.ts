export interface Customer {
  id: number
  name: string
}

export interface CustomerInput {
  name: string
}

export interface ListResponse<T> {
  data: T[]
  total: number
}

async function requestJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(url, {
    headers,
    ...init,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message ?? 'Request failed')
  }

  return payload as T
}

export function listCustomers() {
  return requestJSON<ListResponse<Customer>>('/api/customers')
}

export function getCustomer(id: number) {
  return requestJSON<Customer>(`/api/customers/${id}`)
}

export function createCustomer(payload: CustomerInput) {
  return requestJSON<Customer>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateCustomer(id: number, payload: CustomerInput) {
  return requestJSON<Customer>(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteCustomer(id: number) {
  await requestJSON<void>(`/api/customers/${id}`, { method: 'DELETE' })
}