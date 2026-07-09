export interface UploadOptions {
  upsert?: boolean
  contentType?: string
  cacheControl?: string
}

export interface StorageAdapter {
  upload(
    path: string,
    file: File | Buffer,
    options?: UploadOptions
  ): Promise<{ url: string }>
  delete(path: string): Promise<void>
  getUrl(path: string): string
}
