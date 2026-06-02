import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface LekkerLetterEmailProps {
  recipientName?: string;
  voucherTitle?: string;
  locationName?: string;
  locationAddress?: string;
  voucherCode?: string;
  validUntil?: string;
}

export default function LekkerLetterEmail({
  recipientName = "Anna",
  voucherTitle = "Zwei Drinks nach Wahl",
  locationName = "Bar Schmitz, Köln",
  locationAddress = "Aachener Str. 28, 50674 Köln",
  voucherCode = "LEKKER-TEST-001",
  validUntil = "31.12.2025",
}: LekkerLetterEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ein kleines Geschenk wartet auf dich 🎁</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerText}>Lekker Letter</Heading>
          </Section>

          {/* Greeting */}
          <Section style={content}>
            <Text style={greeting}>Hey {recipientName},</Text>
            <Text style={message}>
              jemand Besonderes hat an dich gedacht — und dir mit diesem Brief
              einen kleinen Moment zum Genießen geschickt. Nimm dir die Zeit,
              lass den Alltag kurz pausieren, und stoß auf die schönen Dinge an.
            </Text>
          </Section>

          {/* Voucher Card */}
          <Section style={voucherCard}>
            <Text style={voucherTitleStyle}>{voucherTitle}</Text>
            <Text style={voucherLocation}>{locationName}</Text>
            <Text style={voucherAddressStyle}>{locationAddress}</Text>
            <Section style={divider} />
            <Text style={codeLabel}>Dein Code</Text>
            <Text style={codeText}>{voucherCode}</Text>
            <Text style={validText}>Gültig bis {validUntil}</Text>
          </Section>

          {/* Closing */}
          <Section style={content}>
            <Text style={closing}>
              Wir hoffen, du genießt jeden Schluck. Prost! 🥂
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Mit Liebe verschickt von Lekker Letter
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#f5f5f0",
  fontFamily: "'Georgia', serif",
  margin: 0,
  padding: "40px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "520px",
  margin: "0 auto",
  borderRadius: "4px",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  backgroundColor: "#1a1a1a",
  padding: "32px 40px",
  textAlign: "center",
};

const headerText: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "400",
  letterSpacing: "3px",
  margin: 0,
  textTransform: "uppercase",
};

const content: React.CSSProperties = {
  padding: "32px 40px 0",
};

const greeting: React.CSSProperties = {
  fontSize: "20px",
  color: "#1a1a1a",
  margin: "0 0 16px",
  fontWeight: "400",
};

const message: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: "1.7",
  color: "#444444",
  margin: "0 0 32px",
};

const voucherCard: React.CSSProperties = {
  backgroundColor: "#fafaf7",
  border: "1px solid #e8e8e0",
  borderRadius: "4px",
  margin: "8px 40px 32px",
  padding: "28px 32px",
  textAlign: "center",
};

const voucherTitleStyle: React.CSSProperties = {
  fontSize: "22px",
  color: "#1a1a1a",
  fontWeight: "600",
  margin: "0 0 8px",
  letterSpacing: "0.5px",
};

const voucherLocation: React.CSSProperties = {
  fontSize: "16px",
  color: "#555555",
  margin: "0 0 4px",
  fontWeight: "500",
};

const voucherAddressStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#888888",
  margin: "0 0 24px",
};

const divider: React.CSSProperties = {
  borderTop: "1px solid #e8e8e0",
  margin: "0 0 24px",
};

const codeLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#999999",
  letterSpacing: "2px",
  textTransform: "uppercase",
  margin: "0 0 8px",
};

const codeText: React.CSSProperties = {
  fontSize: "18px",
  color: "#1a1a1a",
  fontFamily: "'Courier New', monospace",
  fontWeight: "600",
  letterSpacing: "2px",
  margin: "0 0 12px",
  backgroundColor: "#f0f0e8",
  padding: "8px 16px",
  borderRadius: "3px",
  display: "inline-block",
};

const validText: React.CSSProperties = {
  fontSize: "13px",
  color: "#aaaaaa",
  margin: "0",
};

const closing: React.CSSProperties = {
  fontSize: "16px",
  color: "#444444",
  lineHeight: "1.7",
  margin: "0 0 32px",
};

const footer: React.CSSProperties = {
  borderTop: "1px solid #f0f0e8",
  padding: "24px 40px",
  textAlign: "center",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#bbbbbb",
  margin: 0,
  letterSpacing: "0.5px",
};
