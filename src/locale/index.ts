import i18next from 'i18next'

import { resources } from './locale.resources.ts'
import { Namespaces, SupportedLanguages } from './locale.types.ts'
import { handleInitializationError, printMissingTranslationKeys } from './utils'


if (__DEV__) {
  printMissingTranslationKeys()
}


// TODO: Create initialization function and call it in the app entry point
i18next.init(
  {
    fallbackLng: SupportedLanguages.EN_US,
    defaultNS: Namespaces.COMMON,
    ns: Object.values(Namespaces),
    resources,
    debug: __DEV__,
    interpolation: {
      escapeValue: false,
    },
  },
  error => {
    // TODO: Show the error to the user and/or save it in database
    handleInitializationError(error)
  },
)


export { useLocale } from './locale.hook.ts'
export { translator } from './locale.translator.ts'
export { SupportedLanguages } from './locale.types.ts'
