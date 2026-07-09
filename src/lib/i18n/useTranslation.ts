"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { Language, TranslationValue } from "./config"
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE } from "./config"
import en from "./locales/en.json"
import id from "./locales/id.json"

const translations: Record<Language, TranslationValue> = { en, id }

function getInitialLanguage(): Language {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(^| )${LANGUAGE_COOKIE}=([^;]+)`));
    if (match) return match[2] as Language;
  }
  return DEFAULT_LANGUAGE;
}

let currentLang: Language = getInitialLanguage()
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot() {
  return currentLang
}

export function setLanguage(lang: Language) {
  currentLang = lang
  if (typeof document !== "undefined") {
    document.cookie = `jarvis-lang=${lang};path=/;max-age=31536000`
    document.documentElement.lang = lang
  }
  listeners.forEach((l) => l())
}

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

export function translate(key: string, params?: Record<string, string | number>, lang?: Language): string {
  const t = translations[lang ?? currentLang] ?? translations[DEFAULT_LANGUAGE]
  let text = getNestedValue(t, key)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v))
    }
  }
  return text
}

export function useTranslation() {
  const lang = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_LANGUAGE)

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => translate(key, params, lang),
    [lang],
  )

  return { t, lang, setLanguage }
}
