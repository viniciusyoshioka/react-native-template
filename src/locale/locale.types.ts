import type * as ptBRCommon from './pt-br/common.json'
import type * as ptBRHome from './pt-br/home.json'


export enum SupportedLanguages {
  PT_BR = 'pt-br',
  EN_US = 'en-us',
}


export enum Namespaces {
  COMMON = 'common',
  HOME = 'home',
}


export type LanguagesToNamespacesMapType = {
  [language in SupportedLanguages]: {
    [namespace in Namespaces]: NamespacesToTranslationMapType[namespace]
  }
}


export type NamespacesToTranslationMapType = {
  [Namespaces.COMMON]: typeof ptBRCommon
  [Namespaces.HOME]: typeof ptBRHome
}


export type TranslationKeys<Namespace extends Namespaces> = (
  keyof NamespacesToTranslationMapType[Namespace] & string
)
