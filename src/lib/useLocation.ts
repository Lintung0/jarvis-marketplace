"use client"

import { useCallback, useSyncExternalStore } from "react"

const COOKIE_NAME = "jarvis-location"
const DEFAULT_LOCATION = "Indonesia"

interface LocationInfo {
  name: string
  lat?: number
  lon?: number
}

function getInitialLocation(): LocationInfo {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`))
    if (match) {
      try {
        return JSON.parse(decodeURIComponent(match[2]))
      } catch {}
    }
  }
  return { name: DEFAULT_LOCATION }
}

let currentLocation: LocationInfo = getInitialLocation()
const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot() {
  return currentLocation
}

export function setLocation(location: LocationInfo) {
  currentLocation = location
  if (typeof document !== "undefined") {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(location))};path=/;max-age=31536000`
  }
  listeners.forEach((l) => l())
}

export function useLocation() {
  const location = useSyncExternalStore(subscribe, getSnapshot, () => ({ name: DEFAULT_LOCATION }))

  const setLocationValue = useCallback((loc: LocationInfo) => {
    setLocation(loc)
  }, [])

  return { location, setLocation: setLocationValue }
}
