import { z } from 'zod'
import { zodt } from '@/hooks/use-translation'

export const loginSchema = z.object({
  username: z.string().min(1, zodt('login.form.username.error.required')),
  password: z.string().min(1, zodt('login.form.password.error.required')),
})

export type LoginSchema = z.infer<typeof loginSchema>