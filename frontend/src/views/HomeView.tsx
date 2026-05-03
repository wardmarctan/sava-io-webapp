import { useHomeController } from '../controllers/useHomeController'

export function HomeView() {
  const { count, backendStatus, increment } = useHomeController()

  return (
    <main className="page">
      <section className="card">
        <h1>Frontend MVC</h1>
        <p>
          View ini membaca data dari controller, bukan langsung dari model atau API.
        </p>
        <button type="button" onClick={increment}>
          Count: {count}
        </button>
      </section>

      <section className="card">
        <h2>Backend Status</h2>
        <p>
          Endpoint <strong>GET /api/health</strong>: {backendStatus}
        </p>
      </section>
    </main>
  )
}