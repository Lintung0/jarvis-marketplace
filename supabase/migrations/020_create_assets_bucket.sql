-- Create the assets storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'assets',
  'assets',
  true,
  10485760,
  '{image/jpeg,image/png,image/gif,image/webp,application/pdf,video/mp4,audio/mpeg}'
)
ON CONFLICT (id) DO NOTHING;
