ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS tax_rate numeric NOT NULL DEFAULT 0;
ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS tax_amount numeric NOT NULL DEFAULT 0;
ALTER TABLE public.invoice_items ADD COLUMN IF NOT EXISTS tax_rate numeric NOT NULL DEFAULT 0;
ALTER TABLE public.invoice_items ADD COLUMN IF NOT EXISTS tax_amount numeric NOT NULL DEFAULT 0;