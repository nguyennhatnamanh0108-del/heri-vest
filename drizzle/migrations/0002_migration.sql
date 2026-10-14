ALTER TABLE public.payment_orders ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'vnpay';
ALTER TABLE public.payment_orders ALTER COLUMN amount_vnd SET DEFAULT 0;
CREATE INDEX IF NOT EXISTS payment_orders_provider_txn_idx ON public.payment_orders(provider_txn_no);