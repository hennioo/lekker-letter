import { supabaseAdmin } from '../lib/supabase'

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

async function seed() {
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('vouchers')
    .insert(voucher)
    .select('id')
    .single()

  if (insertError) {
    console.error('Failed to insert voucher:', insertError.message)
    process.exit(1)
  }

  console.log('Inserted voucher:', inserted.id)

  const { error: updateError } = await supabaseAdmin
    .from('scheduled_mails')
    .update({ voucher_id: inserted.id })
    .is('voucher_id', null)

  if (updateError) {
    console.error('Failed to update scheduled_mails:', updateError.message)
    process.exit(1)
  }

  console.log('Linked voucher to all scheduled_mails without a voucher_id')
}

seed()
