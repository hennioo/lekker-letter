'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function createOrder(formData: FormData) {
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

  if (recipientError) throw new Error(`Failed to create recipient: ${recipientError.message}`)

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

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`)

  const scheduledMails = Array.from({ length: durationMonths }, (_, i) => {
    const date = new Date(startDate)
    date.setUTCMonth(date.getUTCMonth() + i)
    return {
      order_id: order.id,
      recipient_id: recipient.id,
      send_date: date.toISOString().split('T')[0],
      status: 'draft',
    }
  })

  const { error: mailsError } = await supabaseAdmin
    .from('scheduled_mails')
    .insert(scheduledMails)

  if (mailsError) throw new Error(`Failed to create scheduled mails: ${mailsError.message}`)

  redirect('/admin/orders')
}
