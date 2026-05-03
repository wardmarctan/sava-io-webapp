import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockKeyhole, Mail, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { login } from '@/lib/api/auth/login'
import { clearAuthTokens, setAccessToken, setRefreshToken } from '@/lib/storage'
import { loginSchema, type LoginSchema } from '../lib/schema'
import { useTranslation } from '@/hooks/use-translation'

export function LoginForm() {
  const { t } = useTranslation('login')
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | undefined>()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: 'admin',
      password: '123456',
    },
  })

  const onSubmit = async (values: LoginSchema) => {
    setServerError(undefined)

    try {
      const response = await login(values.username, values.password)
      clearAuthTokens()
      setAccessToken(response.access_token)
      setRefreshToken(response.refresh_token)
      navigate('/', { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : t('form.error.invalidCredentials')
      setServerError(message)
    }
  }

  return (
    <form className="login-form" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="field">
        <span>{t('form.username.label')}</span>
        <div className="field__control">
          <Mail size={16} />
          <Input placeholder={t('form.username.placeholder')} autoComplete="username" {...form.register('username')} />
        </div>
        {form.formState.errors.username?.message && <small>{form.formState.errors.username.message}</small>}
      </label>

      <label className="field">
        <span>{t('form.password.label')}</span>
        <div className="field__control">
          <LockKeyhole size={16} />
          <PasswordInput placeholder={t('form.password.placeholder')} autoComplete="current-password" {...form.register('password')} />
        </div>
        {form.formState.errors.password?.message && <small>{form.formState.errors.password.message}</small>}
      </label>

      {serverError && <div className="login-form__error">{serverError}</div>}

      <Button type="submit" disabled={form.formState.isSubmitting}>
        <LogIn size={16} />
        {form.formState.isSubmitting ? t('form.submit.loading') : t('form.submit.button')}
      </Button>
    </form>
  )
}