import { supabaseAdmin } from "@/lib/supabase-admin";
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
      <main
        style={{
          background: "var(--ll-paper)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif), serif",
            fontSize: "1.2rem",
            color: "var(--ll-burgundy)",
            textAlign: "center",
          }}
        >
          Bestellung nicht gefunden.
        </p>
      </main>
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
