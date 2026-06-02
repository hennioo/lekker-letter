import { supabaseAdmin } from "@/lib/supabase";
import ConfirmationClient from "./ConfirmationClient";

interface PageProps {
  params: { orderId: string };
}

export default async function ConfirmationPage({ params }: PageProps) {
  const { orderId } = params;

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      giver_name,
      duration_months,
      start_date,
      recipients (name)
    `)
    .eq("id", orderId)
    .single();

  if (!order) {
    return (
      <div style={{ backgroundColor: "#0f0f0f", minHeight: "100vh", color: "#f5f0e8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.1rem", color: "#a09880" }}>
          Bestellung nicht gefunden.
        </p>
      </div>
    );
  }

  const recipient = order.recipients as unknown as { name: string } | null;

  return (
    <ConfirmationClient
      orderId={orderId}
      recipientName={recipient?.name ?? ""}
      giverName={order.giver_name ?? ""}
      durationMonths={order.duration_months ?? 0}
      startDate={order.start_date ?? ""}
    />
  );
}
