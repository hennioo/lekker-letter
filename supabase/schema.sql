CREATE TABLE recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  interests TEXT,
  relationship_to_giver TEXT,
  tone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vouchers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  city TEXT,
  category TEXT,
  description TEXT,
  address TEXT,
  image_url TEXT,
  voucher_code TEXT,
  valid_until DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  giver_name TEXT NOT NULL,
  giver_email TEXT NOT NULL,
  recipient_id UUID REFERENCES recipients(id),
  occasion TEXT,
  duration_months INTEGER DEFAULT 3,
  start_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE mail_status AS ENUM ('draft', 'approved', 'pending', 'sent', 'failed', 'cancelled');

CREATE TABLE scheduled_mails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  recipient_id UUID REFERENCES recipients(id),
  voucher_id UUID REFERENCES vouchers(id),
  send_date DATE NOT NULL,
  status mail_status DEFAULT 'draft',
  generated_subject TEXT,
  generated_text TEXT,
  template_key TEXT DEFAULT 'elegant-minimal',
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
