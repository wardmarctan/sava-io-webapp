import { useEffect, useMemo, useState } from 'react'
import { CounterModel } from '../models/counterModel'
import { fetchHealth } from '../services/healthService'

export function useHomeController() {
  const model = useMemo(() => new CounterModel(), [])
  const [count, setCount] = useState(model.getValue())
  const [backendStatus, setBackendStatus] = useState('loading...')

  useEffect(() => {
    fetchHealth()
      .then((payload) => setBackendStatus(`${payload.data.status} (${payload.data.service})`))
      .catch(() => setBackendStatus('unreachable'))
  }, [])

  const increment = () => {
    setCount(model.increment())
  }

  return {
    count,
    backendStatus,
    increment,
  }
}