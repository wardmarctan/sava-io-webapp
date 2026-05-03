const ACCESS_TOKEN_KEY = 'sava-io.access-token'
const REFRESH_TOKEN_KEY = 'sava-io.refresh-token'
const LANGUAGE_KEY = 'sava-io.language'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function clearRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getLanguage() {
  return localStorage.getItem(LANGUAGE_KEY)
}

export function setLanguage(language: string) {
  localStorage.setItem(LANGUAGE_KEY, language)
}

export function clearAuthTokens() {
  clearAccessToken()
  clearRefreshToken()
}