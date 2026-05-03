import { useMemo } from 'react'
import { useTranslation as useReactI18NextTranslation } from 'react-i18next'

const ZOD_T_DELIMITER = '::'
const ZOD_T_PREFIX = `t${ZOD_T_DELIMITER}`

export type ZodtFunction = (key: string, value?: Record<string, unknown>) => string

export function zodt(key: string, value?: Record<string, unknown>) {
  const transformedKey = `${ZOD_T_PREFIX}${key}`
  return value ? `${transformedKey}${ZOD_T_DELIMITER}${JSON.stringify(value)}` : transformedKey
}

function parseZodTFunction(payload: string): [string, Record<string, unknown> | undefined] {
  if (!payload.startsWith(ZOD_T_PREFIX)) {
    return [payload, undefined]
  }

  const [_, key, ...rest] = payload.split(ZOD_T_DELIMITER)
  if (!key) {
    return [payload, undefined]
  }

  if (rest.length === 0) {
    return [key, undefined]
  }

  try {
    return [key, JSON.parse(rest.join(ZOD_T_DELIMITER))]
  } catch {
    return [key, undefined]
  }
}

interface TFunction {
  (key: string, value?: Record<string, unknown>): string
  zodrich: (payload: string) => string
}

export function useTranslation(ns?: string, options?: Record<string, unknown>) {
  const translation = useReactI18NextTranslation(ns, options)

  const t = useMemo(() => {
    const translate: TFunction = ((key: string, value?: Record<string, unknown>) => translation.t(key, value)) as TFunction
    translate.zodrich = (payload: string) => {
      const [key, value] = parseZodTFunction(payload)
      return translation.t(key, value)
    }
    return translate
  }, [translation])

  return {
    ...translation,
    t,
    zodt,
  }
}