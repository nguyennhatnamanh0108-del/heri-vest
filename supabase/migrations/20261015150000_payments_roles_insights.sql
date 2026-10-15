-- Tables that were created in Lovable Cloud but never committed as migrations.

-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Admin emails get the admin role on sign-up (and retroactively below).
CREATE TABLE public.admin_emails (
  email text PRIMARY KEY
);

ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.admin_emails TO service_role;

CREATE OR REPLACE FUNCTION public.grant_admin_for_listed_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.admin_emails WHERE lower(email) = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.grant_admin_for_listed_email() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_admin_for_listed_email();

-- Payment orders (VNPay / PayPal). Written only by the server with the service role.
CREATE TABLE public.payment_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_ref text NOT NULL UNIQUE,
  provider text NOT NULL DEFAULT 'vnpay',
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  amount_usd numeric NOT NULL,
  amount_vnd bigint NOT NULL DEFAULT 0,
  donor_name text NOT NULL DEFAULT 'Anonymous',
  message text,
  status text NOT NULL DEFAULT 'pending',
  response_code text,
  provider_txn_no text,
  donation_id uuid REFERENCES public.donations(id) ON DELETE SET NULL,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX payment_orders_created_at_idx ON public.payment_orders (created_at DESC);
CREATE INDEX payment_orders_provider_txn_no_idx ON public.payment_orders (provider, provider_txn_no);

GRANT SELECT ON public.payment_orders TO authenticated;
GRANT ALL ON public.payment_orders TO service_role;

ALTER TABLE public.payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment orders"
ON public.payment_orders FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- AI fraud review per donation
CREATE TABLE public.donation_reviews (
  donation_id uuid PRIMARY KEY REFERENCES public.donations(id) ON DELETE CASCADE,
  verdict text NOT NULL DEFAULT 'ok',
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.donation_reviews TO authenticated;
GRANT ALL ON public.donation_reviews TO service_role;

ALTER TABLE public.donation_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view donation reviews"
ON public.donation_reviews FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Cached AI insights per campaign
CREATE TABLE public.campaign_insights (
  campaign_id uuid PRIMARY KEY REFERENCES public.campaigns(id) ON DELETE CASCADE,
  summary text NOT NULL DEFAULT '',
  prediction text NOT NULL DEFAULT '',
  raised_snapshot numeric NOT NULL DEFAULT 0,
  generated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.campaign_insights TO anon, authenticated;
GRANT ALL ON public.campaign_insights TO service_role;

ALTER TABLE public.campaign_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaign insights are publicly viewable"
ON public.campaign_insights FOR SELECT
TO anon, authenticated
USING (true);

INSERT INTO public.admin_emails (email) VALUES ('nguyennhatnamanh0108@gmail.com')
ON CONFLICT DO NOTHING;
