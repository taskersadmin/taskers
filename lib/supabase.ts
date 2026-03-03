import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function generateSignedUploadUrl(path: string, contentType: string) {
  const { data, error } = await supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'job-evidence')
    .createSignedUploadUrl(path);
  
  if (error) throw error;
  return data;
}

export async function getPublicUrl(path: string) {
  const { data } = supabase.storage
    .from(process.env.SUPABASE_STORAGE_BUCKET || 'job-evidence')
    .getPublicUrl(path);
  
  return data.publicUrl;
}
