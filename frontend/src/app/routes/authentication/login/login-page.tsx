import { useTranslation } from '@/hooks/use-translation'
import { LoginForm } from './containers/login-form'

export function LoginPage() {
  const { t } = useTranslation('login')

  return (
    <main className="login-page">
      <section className="login-page__left">
        <div className="login-page__art login-page__art--one" />
        <div className="login-page__art login-page__art--two" />
        <div className="login-page__art login-page__art--three" />
        <div className="login-page__left-content">
          <span className="login-page__brand">
            SAVA.IO
          </span>
          <h2>Secure Your Future with Sava</h2>
          <p>
            Experience the gold standard of digital banking. Our advanced saving system 
            is designed to protect and grow your wealth with institutional-grade security.
          </p>
        </div>
      </section>

      <section className="login-page__right">
        <div className="login-page__card">
          <div className="login-page__card-header">
            <h1>Welcome Back</h1>
            <p>Please enter your institutional credentials</p>
          </div>

          <LoginForm />
        </div>
      </section>
    </main>
  )
}