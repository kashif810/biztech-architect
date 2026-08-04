-- CATALOG: public read, authenticated write
DROP POLICY IF EXISTS "open write products" ON public.products;
DROP POLICY IF EXISTS "public read products" ON public.products;
CREATE POLICY "products_public_read" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "products_auth_write" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open write categories" ON public.product_categories;
DROP POLICY IF EXISTS "public read categories" ON public.product_categories;
CREATE POLICY "categories_public_read" ON public.product_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories_auth_write" ON public.product_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open write services" ON public.services;
DROP POLICY IF EXISTS "public read services" ON public.services;
CREATE POLICY "services_public_read" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "services_auth_write" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT SELECT ON public.products, public.product_categories, public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products, public.product_categories, public.services TO authenticated;
GRANT ALL ON public.products, public.product_categories, public.services TO service_role;

-- SENSITIVE BUSINESS DATA: authenticated only
DROP POLICY IF EXISTS "open customers" ON public.customers;
CREATE POLICY "customers_auth_all" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open suppliers" ON public.suppliers;
CREATE POLICY "suppliers_auth_all" ON public.suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open quotations" ON public.quotations;
CREATE POLICY "quotations_auth_all" ON public.quotations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open quotation_items" ON public.quotation_items;
CREATE POLICY "quotation_items_auth_all" ON public.quotation_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open invoices" ON public.invoices;
CREATE POLICY "invoices_auth_all" ON public.invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open invoice_items" ON public.invoice_items;
CREATE POLICY "invoice_items_auth_all" ON public.invoice_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open payments" ON public.payments;
CREATE POLICY "payments_auth_all" ON public.payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open supplier_bills" ON public.supplier_bills;
CREATE POLICY "supplier_bills_auth_all" ON public.supplier_bills FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open supplier_payments" ON public.supplier_payments;
CREATE POLICY "supplier_payments_auth_all" ON public.supplier_payments FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "open settings" ON public.accounting_settings;
CREATE POLICY "settings_auth_all" ON public.accounting_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

REVOKE ALL ON public.customers, public.suppliers, public.quotations, public.quotation_items,
  public.invoices, public.invoice_items, public.payments, public.supplier_bills,
  public.supplier_payments, public.accounting_settings FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers, public.suppliers, public.quotations, public.quotation_items,
  public.invoices, public.invoice_items, public.payments, public.supplier_bills,
  public.supplier_payments, public.accounting_settings TO authenticated;
GRANT ALL ON public.customers, public.suppliers, public.quotations, public.quotation_items,
  public.invoices, public.invoice_items, public.payments, public.supplier_bills,
  public.supplier_payments, public.accounting_settings TO service_role;

-- LEADS: public insert only, authenticated full access
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can read leads" ON public.leads;
CREATE POLICY "leads_public_insert" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "leads_auth_all" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);

REVOKE ALL ON public.leads FROM anon;
GRANT INSERT ON public.leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;