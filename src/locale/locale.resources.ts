import type { LanguagesToNamespacesMapType } from './locale.types.ts'
import { Namespaces, SupportedLanguages } from './locale.types.ts'

import * as enUSCommon from './en-us/common.json'
import * as enUSHome from './en-us/home.json'
import * as ptBRCommon from './pt-br/common.json'
import * as ptBRHome from './pt-br/home.json'


export const resources: LanguagesToNamespacesMapType = {
  [SupportedLanguages.EN_US]: {
    [Namespaces.COMMON]: enUSCommon,
    [Namespaces.HOME]: enUSHome,
  },
  [SupportedLanguages.PT_BR]: {
    [Namespaces.COMMON]: ptBRCommon,
    [Namespaces.HOME]: ptBRHome,
  },
}
