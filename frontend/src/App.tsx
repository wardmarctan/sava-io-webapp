import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { AuthLayout } from '@/components/layouts/auth-layout'
import { LoginPage } from '@/app/routes/authentication/login/login-page'
import { DashboardPage } from '@/app/routes/dashboard/dashboard-page'
import { CustomersPage } from '@/app/routes/customers/customers-page'
import { AccountsPage } from '@/app/routes/accounts/accounts-page'
import { DepositoTypesPage } from '@/app/routes/deposito-types/deposito-types-page'
import { DepositPage } from '@/app/routes/transactions/deposit-page'
import { WithdrawPage } from '@/app/routes/transactions/withdraw-page'
import { TransactionHistoryPage } from '@/app/routes/transactions/transaction-history-page'
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
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/dashboard',
      element: getAccessToken() ? <DashboardPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '/customers',
      element: getAccessToken() ? <CustomersPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '/accounts',
      element: getAccessToken() ? <AccountsPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '/deposito-types',
      element: getAccessToken() ? <DepositoTypesPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '/deposit',
      element: getAccessToken() ? <DepositPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '/withdraw',
      element: getAccessToken() ? <WithdrawPage /> : <Navigate to="/login" replace />,
    },
    {
      path: '/transaction-history',
      element: getAccessToken() ? <TransactionHistoryPage /> : <Navigate to="/login" replace />,
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
