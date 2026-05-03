export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: {
    username: string
    role: string
  }
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(payload.message ?? 'Invalid username or password')
  }

  return payload as LoginResponse
}