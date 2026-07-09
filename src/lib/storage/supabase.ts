import { createAdminClient } from "@/lib/supabase/server"
import type { StorageAdapter, UploadOptions } from "."

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""

async function ensureBucket(bucket: string) {
  const admin = createAdminClient()
  const { data: buckets } = await admin.storage.listBuckets()
  if (!buckets?.some((b) => b.name === bucket)) {
    await admin.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    })
  }
}

export class SupabaseStorageAdapter implements StorageAdapter {
  private bucket: string

  constructor(bucket = "assets") {
    this.bucket = bucket
  }

  async upload(
    path: string,
    file: File | Buffer,
    options?: UploadOptions
  ): Promise<{ url: string }> {
    await ensureBucket(this.bucket)
    const supabase = createAdminClient()

    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? true,
        contentType: options?.contentType,
        cacheControl: options?.cacheControl ?? "3600",
      })

    if (error) {
      throw new Error(`Supabase upload failed: ${error.message}`)
    }

    return { url: this.getUrl(data.path) }
  }

  async delete(path: string): Promise<void> {
    const supabase = createAdminClient()

    const { error } = await supabase.storage
      .from(this.bucket)
      .remove([path])

    if (error) {
      throw new Error(`Supabase delete failed: ${error.message}`)
    }
  }

  getUrl(path: string): string {
    const base = SUPABASE_URL.replace(/\/$/, "")
    return `${base}/storage/v1/object/public/${this.bucket}/${path}`
  }
}
