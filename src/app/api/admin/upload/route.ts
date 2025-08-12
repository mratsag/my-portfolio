import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // Service role client kullan (RLS bypass için)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Cookie'lerden session'ı al
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }
    
    // Bearer token'ı al
    const token = authHeader.replace('Bearer ', '')
    
    // Token ile kullanıcıyı doğrula
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large' }, { status: 400 })
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Dosya adını unique yap
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // URL'den hangi tür yükleme olduğunu anla
    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'project'
    
    let filePath
    if (type === 'avatar') {
      filePath = `avatars/${fileName}`
    } else {
      filePath = `projects/${fileName}`
    }

    // Dosyayı buffer'a çevir
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Supabase Storage'a yükle
    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Public URL al
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(data.path)



    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      path: data.path 
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 