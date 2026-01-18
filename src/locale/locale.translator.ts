import i18next from 'i18next'

import type { SupportedLanguages, TranslationKeys } from './locale.types.ts'
import { Namespaces } from './locale.types.ts'


export class Translator {


  get currentLanguage(): SupportedLanguages {
    return i18next.language as SupportedLanguages
  }


  async changeLanguage(language: SupportedLanguages): Promise<void> {
    await i18next.changeLanguage(language)
  }


  t<Namespace extends Namespaces = Namespaces.COMMON>(
    key: TranslationKeys<Namespace>,
    options?: {
      ns: Namespace
    },
  ): string {
    const { ns = Namespaces.COMMON } = options ?? {}

    return i18next.t(key, {
      ns,
    })
  }
}


export const translator = new Translator()
