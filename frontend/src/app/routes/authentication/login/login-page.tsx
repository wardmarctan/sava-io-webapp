import { ArrowRight, CircleUserRound, ShieldCheck, Sparkles } from 'lucide-react'
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
            <Sparkles size={16} />
            Sava IO
          </span>
          <h2>{t('banner.title')}</h2>
          <p>{t('banner.description')}</p>
          <div className="login-page__status">
            <span>
              <ShieldCheck size={14} />
              Go backend
            </span>
            <span>
              <CircleUserRound size={14} />
              admin / 123456
            </span>
          </div>
        </div>
      </section>

      <section className="login-page__right">
        <div className="login-page__card">
          <div className="login-page__card-header">
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>
          </div>

          <LoginForm />

          <a className="login-page__forgot" href="#forgot-password">
            {t('form.forgotPassword')}
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </main>
  )
}