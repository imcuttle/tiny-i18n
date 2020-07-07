export type Locale = {
  [key: string]: string
}

export type Dictionary = {
  [language: string]: Locale
}

export interface TinyI18n {
  i18n: (key: string, ...argv: any[]) => string
  setDictionary: (dict: Locale, language?: string) => void
  setLanguage: (language: string) => void
  getDataBase: () => Dictionary
  getCurrentLanguage: () => string
  getDictionary: (language?: string) => Locale
  getLanguages: () => string[]
  getWord: (key: string, language?: string) => string
  extendDictionary: (dict: Locale, language?: string) => void
}

export const createIsolateI18n: () => TinyI18n

declare const tinyI18n: TinyI18n
export default tinyI18n
