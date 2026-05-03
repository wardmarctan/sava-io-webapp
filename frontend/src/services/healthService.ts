type HealthResponse = {
  success: boolean
  data: {
    service: string
    status: string
    timestamp: string
  }
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('http://localhost:3000/api/health')
  if (!res.ok) {
    throw new Error('Tidak bisa mengambil status backend')
  }
  return res.json()
}