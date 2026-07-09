import type { StorageAdapter } from "."
import { SupabaseStorageAdapter } from "./supabase"
import { S3StorageAdapter } from "./s3"

let cachedAdapter: StorageAdapter | null = null

export function getStorageDriver(): StorageAdapter {
  if (cachedAdapter) {
    return cachedAdapter
  }

  const driver = process.env.STORAGE_DRIVER || "supabase"

  switch (driver) {
    case "s3":
    case "r2":
    case "b2":
      cachedAdapter = new S3StorageAdapter()
      break
    case "supabase":
    default:
      cachedAdapter = new SupabaseStorageAdapter()
      break
  }

  return cachedAdapter
}

export function resetStorageCache(): void {
  cachedAdapter = null
}
