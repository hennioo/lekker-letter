import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateEmailText } from '@/lib/generateEmailText'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      scheduledMailId: string
      voucherTitle: string
      voucherDescription: string
    }

    const { scheduledMailId, voucherTitle, voucherDescription } = body
    console.log('[generate-letter-text] Request:', { scheduledMailId, voucherTitle, voucherDescription })

    if (!scheduledMailId || !voucherTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: mail, error: mailError } = await supabaseAdmin
      .from('scheduled_mails')
      .select('id, order_id, recipient_id, recipients(name, interests, relationship_to_giver, city, tone)')
      .eq('id', scheduledMailId)
      .single()

    console.log('[generate-letter-text] Mail query result:', { mail, mailError })

    if (mailError || !mail) {
      return NextResponse.json({ error: 'Scheduled mail not found', detail: mailError?.message }, { status: 404 })
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('occasion')
      .eq('id', mail.order_id)
      .single()

    console.log('[generate-letter-text] Order query result:', { order, orderError })

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found', detail: orderError?.message }, { status: 404 })
    }

    const recipient = mail.recipients as unknown as {
      name: string
      interests: string | null
      relationship_to_giver: string | null
      city: string | null
      tone: string | null
    } | null

    console.log('[generate-letter-text] Recipient:', recipient)

    if (!recipient) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    }

    const generated = await generateEmailText({
      recipientName: recipient.name,
      occasion: order.occasion ?? '',
      interests: recipient.interests,
      relationshipToGiver: recipient.relationship_to_giver,
      city: recipient.city,
      voucherTitle,
      voucherDescription,
      tone: recipient.tone,
    })

    console.log('[generate-letter-text] Generated:', generated)

    const { error: updateError } = await supabaseAdmin
      .from('scheduled_mails')
      .update({
        generated_subject: generated.subject,
        generated_text: JSON.stringify(generated),
      })
      .eq('id', scheduledMailId)

    if (updateError) {
      console.error('[generate-letter-text] Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save generated text', detail: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, ...generated })
  } catch (err) {
    console.error('[generate-letter-text] Unhandled error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
