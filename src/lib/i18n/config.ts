export type Language = "id" | "en"

export interface TranslationValue {
  [key: string]: string | TranslationValue
}

export type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string
    ? T[K] extends string ? K : `${K}.${NestedKeyOf<T[K]>}`
    : never
  }[keyof T]
  : never

export const languages: Record<Language, { name: string; flag: string }> = {
  id: { name: "Indonesia", flag: "🇮🇩" },
  en: { name: "English", flag: "🇬🇧" },
}

export const DEFAULT_LANGUAGE: Language = "id"
export const LANGUAGE_COOKIE = "jarvis-lang"
