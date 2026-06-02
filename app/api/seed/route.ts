import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const voucher = {
  title: 'Zwei Drinks nach Wahl',
  partner_name: 'Bar Schmitz',
  city: 'Köln',
  category: 'Bar & Drinks',
  description: 'Zwei Drinks eurer Wahl an einem gemütlichen Abend',
  address: 'Aachener Str. 28, 50674 Köln',
  voucher_code: 'LEKKER-SCHMITZ-001',
  valid_until: '2026-12-31',
  active: true,
}

export async function GET() {
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('vouchers')
    .insert(voucher)
    .select('id')
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  const { error: updateError } = await supabaseAdmin
    .from('scheduled_mails')
    .update({ voucher_id: inserted.id })
    .is('voucher_id', null)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    voucher_id: inserted.id,
    message: 'Voucher inserted and linked to all scheduled_mails without a voucher_id',
  })
}
