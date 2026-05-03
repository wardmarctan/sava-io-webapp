import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield, User, LogIn } from 'lucide-react'
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
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : t('form.error.invalidCredentials')
      setServerError(message)
    }
  }

  return (
    <form className="login-form" onSubmit={form.handleSubmit(onSubmit)}>
      <label className="field">
        <span>Username</span>
        <div className="field__control">
          <User size={20} />
          <Input placeholder="Enter your username" autoComplete="username" {...form.register('username')} />
        </div>
        {form.formState.errors.username?.message && <small>{form.formState.errors.username.message}</small>}
      </label>

      <label className="field">
        <span>Password</span>
        <div className="field__control">
          <Shield size={20} />
          <PasswordInput placeholder="Enter your password" autoComplete="current-password" {...form.register('password')} />
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