import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { Translator } from './locale.translator.ts'
import type { SupportedLanguages } from './locale.types.ts'


export function useLocale(): Translator {


  const { t, i18n } = useTranslation()


  const translator = useMemo<Translator>(() => {
    const currentLanguage = i18n.language as SupportedLanguages

    const changeLanguage = async (newLanguage: SupportedLanguages) => {
      await i18n.changeLanguage(newLanguage)
    }

    return {
      t,
      currentLanguage,
      changeLanguage,
    }
  }, [t, i18n])


  return translator
}
