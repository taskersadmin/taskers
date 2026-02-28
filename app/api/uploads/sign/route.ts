import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobId, type, fileType, fileSize } = body

    const path = `${jobId}/${type.toLowerCase()}_${Date.now()}.jpg`

    const { data, error } = await supabase
      .storage
      .from(process.env.SUPABASE_STORAGE_BUCKET!)
      .createSignedUploadUrl(path)

    if (error) throw error

    return NextResponse.json({ signedUrl: data.signedUrl, path })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 })
  }
}
