
-- Accounting module tables

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'Pakistan',
  ntn text NOT NULL DEFAULT '',
  strn text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO anon, authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'Pakistan',
  ntn text NOT NULL DEFAULT '',
  strn text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  default_credit_days integer NOT NULL DEFAULT 30,
  bank_details text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.suppliers TO anon, authenticated;
GRANT ALL ON public.suppliers TO service_role;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open suppliers" ON public.suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_suppliers_updated BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  date date NOT NULL DEFAULT CURRENT_DATE,
  valid_until date,
  status text NOT NULL DEFAULT 'draft',
  currency text NOT NULL DEFAULT 'PKR',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax_rate numeric(6,2) NOT NULL DEFAULT 0,
  tax_amount numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  terms text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotations TO anon, authenticated;
GRANT ALL ON public.quotations TO service_role;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open quotations" ON public.quotations FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_quotations_updated BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  quantity numeric(12,2) NOT NULL DEFAULT 1,
  unit_price numeric(14,2) NOT NULL DEFAULT 0,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotation_items TO anon, authenticated;
GRANT ALL ON public.quotation_items TO service_role;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open quotation_items" ON public.quotation_items FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  po_number text NOT NULL DEFAULT '',
  po_date date,
  status text NOT NULL DEFAULT 'unpaid',
  currency text NOT NULL DEFAULT 'PKR',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax_rate numeric(6,2) NOT NULL DEFAULT 16,
  tax_amount numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  paid_amount numeric(14,2) NOT NULL DEFAULT 0,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  terms text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO anon, authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open invoices" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  quantity numeric(12,2) NOT NULL DEFAULT 1,
  unit_price numeric(14,2) NOT NULL DEFAULT 0,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_items TO anon, authenticated;
GRANT ALL ON public.invoice_items TO service_role;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open invoice_items" ON public.invoice_items FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'cheque',
  reference_no text NOT NULL DEFAULT '',
  bank_name text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO anon, authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open payments" ON public.payments FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.supplier_bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  supplier_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  related_invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  credit_days integer NOT NULL DEFAULT 30,
  due_date date,
  status text NOT NULL DEFAULT 'unpaid',
  subtotal numeric(14,2) NOT NULL DEFAULT 0,
  tax_rate numeric(6,2) NOT NULL DEFAULT 0,
  tax_amount numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) NOT NULL DEFAULT 0,
  paid_amount numeric(14,2) NOT NULL DEFAULT 0,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_bills TO anon, authenticated;
GRANT ALL ON public.supplier_bills TO service_role;
ALTER TABLE public.supplier_bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open supplier_bills" ON public.supplier_bills FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_supplier_bills_updated BEFORE UPDATE ON public.supplier_bills FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.supplier_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id uuid REFERENCES public.supplier_bills(id) ON DELETE SET NULL,
  supplier_id uuid REFERENCES public.suppliers(id) ON DELETE SET NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'cheque',
  reference_no text NOT NULL DEFAULT '',
  bank_name text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.supplier_payments TO anon, authenticated;
GRANT ALL ON public.supplier_payments TO service_role;
ALTER TABLE public.supplier_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open supplier_payments" ON public.supplier_payments FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.accounting_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  company_name text NOT NULL DEFAULT 'Evertech Corporation',
  address text NOT NULL DEFAULT '1F, 210 A, Scotch Corner, Upper Mall Scheme, Lahore, Punjab 54000, Pakistan',
  phone text NOT NULL DEFAULT '+92 321 844 6447',
  email text NOT NULL DEFAULT 'info@evertechcorp.com',
  website text NOT NULL DEFAULT 'www.evertechcorp.com',
  ntn text NOT NULL DEFAULT '3585298-4',
  strn text NOT NULL DEFAULT '',
  bank_details text NOT NULL DEFAULT '',
  default_tax_rate numeric(6,2) NOT NULL DEFAULT 16,
  default_credit_days integer NOT NULL DEFAULT 30,
  quotation_prefix text NOT NULL DEFAULT '',
  invoice_prefix text NOT NULL DEFAULT 'ETC-',
  quotation_next_seq integer NOT NULL DEFAULT 1272,
  invoice_next_seq integer NOT NULL DEFAULT 953,
  quotation_terms text NOT NULL DEFAULT E'Payment Terms: 100% payment by cheque against invoice.\nDelivery Terms: Ex-Stock otherwise 6-8 weeks after order confirmation.\nQuotation will change due to exchange rate, only 1% of currency difference can be adjusted.\nDue to ongoing supply constraints and dynamic market conditions, stock availability cannot be guaranteed and may change at any time without prior notice.\nInstallation: Quoted prices are for hardware only, installation/deployment not covered.\nP.S This is a computer-generated document and does not require any signature.',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounting_settings TO anon, authenticated;
GRANT ALL ON public.accounting_settings TO service_role;
ALTER TABLE public.accounting_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open settings" ON public.accounting_settings FOR ALL USING (true) WITH CHECK (true);
CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.accounting_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.accounting_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Sequence helper function (atomic increment + return current formatted number)
CREATE OR REPLACE FUNCTION public.next_document_number(doc_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  seq integer;
  prefix text;
  yy text;
BEGIN
  yy := to_char(CURRENT_DATE, 'YY');
  IF doc_type = 'quotation' THEN
    UPDATE public.accounting_settings SET quotation_next_seq = quotation_next_seq + 1 WHERE id = 1
      RETURNING quotation_next_seq - 1, quotation_prefix INTO seq, prefix;
    RETURN prefix || lpad(seq::text, 6, '0') || '/' || yy;
  ELSIF doc_type = 'invoice' THEN
    UPDATE public.accounting_settings SET invoice_next_seq = invoice_next_seq + 1 WHERE id = 1
      RETURNING invoice_next_seq - 1, invoice_prefix INTO seq, prefix;
    RETURN prefix || seq::text || '/' || yy;
  END IF;
  RETURN NULL;
END $$;

GRANT EXECUTE ON FUNCTION public.next_document_number(text) TO anon, authenticated, service_role;
