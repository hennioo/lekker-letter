'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'

export type CreateOrderState = { error: string } | null

// setUTCMonth overflows when the day doesn't exist in the target month (e.g. Jan 31 + 1 month → Mar 2/3).
// This helper clamps to the last valid day instead.
function addMonthsSafe(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const totalMonths = (m - 1) + months
  const newYear = y + Math.floor(totalMonths / 12)
  const newMonth = totalMonths % 12
  const lastDay = new Date(Date.UTC(newYear, newMonth + 1, 0)).getUTCDate()
  const newDay = Math.min(d, lastDay)
  return `${newYear}-${String(newMonth + 1).padStart(2, '0')}-${String(newDay).padStart(2, '0')}`
}

export async function createOrder(_prev: CreateOrderState, formData: FormData): Promise<CreateOrderState> {
  const giverName = formData.get('giver_name') as string
  const giverEmail = formData.get('giver_email') as string
  const recipientName = formData.get('recipient_name') as string
  const recipientEmail = formData.get('recipient_email') as string
  const city = (formData.get('city') as string) || 'Köln'
  const interests = formData.get('interests') as string
  const occasion = formData.get('occasion') as string
  const relationshipToGiver = formData.get('relationship_to_giver') as string
  const tone = formData.get('tone') as string
  const startDate = formData.get('start_date') as string
  const durationMonths = parseInt(formData.get('duration_months') as string, 10)

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!giverName?.trim()) return { error: 'Giver name is required' }
  if (!recipientName?.trim()) return { error: 'Recipient name is required' }
  if (!emailRe.test(giverEmail)) return { error: 'Invalid giver email' }
  if (!emailRe.test(recipientEmail)) return { error: 'Invalid recipient email' }
  if (isNaN(durationMonths) || durationMonths < 1) return { error: 'Invalid duration' }
  if (!startDate) return { error: 'Start date is required' }

  const { data: recipient, error: recipientError } = await supabaseAdmin
    .from('recipients')
    .insert({
      name: recipientName,
      email: recipientEmail,
      city,
      interests,
      relationship_to_giver: relationshipToGiver,
      tone,
    })
    .select()
    .single()

  if (recipientError) return { error: `Failed to create recipient: ${recipientError.message}` }

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      giver_name: giverName,
      giver_email: giverEmail,
      recipient_id: recipient.id,
      occasion,
      duration_months: durationMonths,
      start_date: startDate,
      status: 'active',
    })
    .select()
    .single()

  if (orderError) {
    await supabaseAdmin.from('recipients').delete().eq('id', recipient.id)
    return { error: `Failed to create order: ${orderError.message}` }
  }

  const { data: vouchers, error: vouchersError } = await supabaseAdmin
    .from('vouchers')
    .select('id')
    .eq('active', true)

  if (vouchersError || !vouchers?.length) {
    await supabaseAdmin.from('orders').delete().eq('id', order.id)
    await supabaseAdmin.from('recipients').delete().eq('id', recipient.id)
    return { error: 'No active vouchers found — please add vouchers first' }
  }

  const scheduledMails = Array.from({ length: durationMonths }, (_, i) => ({
    order_id: order.id,
    recipient_id: recipient.id,
    voucher_id: vouchers[i % vouchers.length].id,
    send_date: addMonthsSafe(startDate, i),
    status: 'draft',
  }))

  const { error: mailsError } = await supabaseAdmin
    .from('scheduled_mails')
    .insert(scheduledMails)

  if (mailsError) {
    await supabaseAdmin.from('orders').delete().eq('id', order.id)
    await supabaseAdmin.from('recipients').delete().eq('id', recipient.id)
    return { error: `Failed to create scheduled mails: ${mailsError.message}` }
  }

  redirect('/admin/orders')
}
