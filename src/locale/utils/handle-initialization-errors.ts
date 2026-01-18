import { normalizeError } from '@utils'


export function handleInitializationError(error: unknown): void {
  if (!error) return

  const normalizedError = normalizeError(error)
  console.error('[i18n] Error during locale initialization')
  console.error(normalizedError)
}
