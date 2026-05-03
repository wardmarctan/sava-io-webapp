import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { LoginPage } from '@/app/routes/authentication/login/login-page'
import { DashboardPage } from '@/app/routes/dashboard/dashboard-page'
import { CustomersPage } from '@/app/routes/customers/customers-page'
import { getAccessToken } from '@/lib/storage'
import { Toaster } from 'sonner'

function App() {
  const router = createBrowserRouter([
    {
      element: <AuthLayout />,
      children: [
        { path: '/login', element: <LoginPage /> },
      ],
    },
    {
      path: '/',
      element: getAccessToken() ? <DashboardPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '/customers',
      element: getAccessToken() ? <CustomersPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
