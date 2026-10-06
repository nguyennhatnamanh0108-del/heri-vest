CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

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
CREATE POLICY "Insights are publicly viewable" ON public.campaign_insights FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.donation_reviews (
  donation_id uuid PRIMARY KEY REFERENCES public.donations(id) ON DELETE CASCADE,
  verdict text NOT NULL DEFAULT 'ok',
  reason text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.donation_reviews TO authenticated;
GRANT ALL ON public.donation_reviews TO service_role;
ALTER TABLE public.donation_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view donation reviews" ON public.donation_reviews FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view donations" ON public.donations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));