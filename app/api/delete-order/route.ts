import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json() as { orderId: string }

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 })
    }

    // Fetch the order first to get recipient_id before deleting
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('recipient_id')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      console.error('[delete-order] Order not found:', fetchError?.message)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const recipientId = order.recipient_id as string

    // 1. Delete scheduled mails for this order
    const { error: mailsError } = await supabaseAdmin
      .from('scheduled_mails')
      .delete()
      .eq('order_id', orderId)

    if (mailsError) {
      console.error('[delete-order] Failed to delete scheduled_mails:', mailsError.message)
      return NextResponse.json({ error: mailsError.message }, { status: 500 })
    }

    // 2. Delete the order
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (orderError) {
      console.error('[delete-order] Failed to delete order:', orderError.message)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // 3. Delete recipient only if they have no other orders
    const { count, error: countError } = await supabaseAdmin
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', recipientId)

    if (countError) {
      console.error('[delete-order] Failed to count remaining orders for recipient:', countError.message)
      // Non-fatal — order is already deleted
    } else if (count === 0) {
      const { error: recipientError } = await supabaseAdmin
        .from('recipients')
        .delete()
        .eq('id', recipientId)

      if (recipientError) {
        console.error('[delete-order] Failed to delete recipient:', recipientError.message)
        // Non-fatal — order is already deleted
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[delete-order] Unexpected error:', err)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
