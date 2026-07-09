import { cookies } from "next/headers"
import type { TranslationValue } from "./config"
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE } from "./config"
import en from "./locales/en.json"
import id from "./locales/id.json"

const translations: Record<string, TranslationValue> = { en, id }

function getNestedValue(obj: TranslationValue, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof current === "string" ? current : path
}

export async function getTranslation() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get(LANGUAGE_COOKIE)?.value ?? DEFAULT_LANGUAGE) as keyof typeof translations
  const dict = translations[lang] ?? translations[DEFAULT_LANGUAGE]

  return {
    t: (key: string, params?: Record<string, string | number>) => {
      let text = getNestedValue(dict, key)
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          text = text.replace(`{${k}}`, String(v))
        }
      }
      return text
    },
    lang,
    dict,
  }
}
