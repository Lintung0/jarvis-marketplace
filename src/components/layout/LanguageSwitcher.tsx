"use client"

import { useTranslation, languages } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { lang, setLanguage } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as Language;
    setLanguage(val);
    // Reload to apply translations to server components
    window.location.reload();
  };

  return (
    <select
      value={lang}
      onChange={handleChange}
      className="bg-transparent text-gray-300 text-xs focus:outline-none cursor-pointer hover:text-white transition-colors"
    >
      {Object.entries(languages).map(([code, { name, flag }]) => (
        <option key={code} value={code} className="text-gray-800">
          {flag} {name}
        </option>
      ))}
    </select>
  );
}
