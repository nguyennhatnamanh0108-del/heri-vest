CREATE TABLE public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_ref text NOT NULL UNIQUE,
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id),
  amount_usd numeric NOT NULL CHECK (amount_usd > 0 AND amount_usd <= 100000),
  amount_vnd bigint NOT NULL CHECK (amount_vnd > 0),
  donor_name text NOT NULL DEFAULT 'Anonymous',
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed')),
  provider_txn_no text,
  response_code text,
  donation_id uuid REFERENCES public.donations(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
GRANT ALL ON public.payment_orders TO service_role;
ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view payment orders" ON public.payment_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.payment_orders TO authenticated;
DROP POLICY IF EXISTS "Anyone can donate" ON public.donations;