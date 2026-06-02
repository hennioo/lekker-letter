import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { scheduledMailId } = await req.json() as { scheduledMailId: string }
    if (!scheduledMailId) {
      return NextResponse.json({ error: 'Missing scheduledMailId' }, { status: 400 })
    }
    const { error } = await supabaseAdmin
      .from('scheduled_mails')
      .update({ status: 'approved' })
      .eq('id', scheduledMailId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
