const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const
type LogLevel = keyof typeof LOG_LEVELS

const currentLevel: LogLevel =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) ?? (process.env.NODE_ENV === "production" ? "warn" : "debug")

function log(level: LogLevel, message: string, meta?: unknown) {
  if (LOG_LEVELS[level] < LOG_LEVELS[currentLevel]) return

  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`

  if (meta) {
    console[level](`${prefix} ${message}`, meta)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

export const logger = {
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
}
