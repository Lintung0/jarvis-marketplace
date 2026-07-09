import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3"

import type { StorageAdapter, UploadOptions } from "."

interface S3Config {
  endpoint: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
  publicUrl: string
}

export class S3StorageAdapter implements StorageAdapter {
  private client: S3Client
  private bucket: string
  private publicUrl: string

  constructor(config?: Partial<S3Config>) {
    const endpoint = config?.endpoint || process.env.S3_ENDPOINT || ""
    const region = config?.region || process.env.S3_REGION || "auto"
    const accessKeyId = config?.accessKeyId || process.env.S3_ACCESS_KEY_ID || ""
    const secretAccessKey =
      config?.secretAccessKey || process.env.S3_SECRET_ACCESS_KEY || ""
    const bucket = config?.bucket || process.env.S3_BUCKET || "jarvis-assets"
    const publicUrl = config?.publicUrl || process.env.S3_PUBLIC_URL || ""

    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        "S3 credentials not configured. Set S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY env vars."
      )
    }

    this.client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: !endpoint.includes("amazonaws.com"),
    })

    this.bucket = bucket
    this.publicUrl = publicUrl
  }

  async upload(
    path: string,
    file: File | Buffer,
    options?: UploadOptions
  ): Promise<{ url: string }> {
    let buffer: Buffer
    if (Buffer.isBuffer(file)) {
      buffer = file
    } else {
      buffer = Buffer.from(await file.arrayBuffer())
    }

    const input: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: path,
      Body: buffer,
      ContentType: options?.contentType || this.inferContentType(path),
      CacheControl: options?.cacheControl || "public, max-age=3600",
    }

    const command = new PutObjectCommand(input)
    await this.client.send(command)

    return { url: this.getUrl(path) }
  }

  async delete(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: path,
    })

    await this.client.send(command)
  }

  getUrl(path: string): string {
    if (this.publicUrl) {
      const base = this.publicUrl.replace(/\/$/, "")
      return `${base}/${path}`
    }

    const endpoint = (process.env.S3_ENDPOINT || "").replace(/\/$/, "")
    return `${endpoint}/${this.bucket}/${path}`
  }

  private inferContentType(path: string): string {
    const ext = path.split(".").pop()?.toLowerCase()
    const map: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      pdf: "application/pdf",
      mp4: "video/mp4",
      mp3: "audio/mpeg",
      zip: "application/zip",
      json: "application/json",
    }
    return map[ext || ""] || "application/octet-stream"
  }
}
