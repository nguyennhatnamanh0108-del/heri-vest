CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  blurb text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Wildlife',
  location text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '🌿',
  image_focus text NOT NULL DEFAULT 'center',
  goal_amount numeric NOT NULL DEFAULT 0,
  raised_amount numeric NOT NULL DEFAULT 0,
  donor_count integer NOT NULL DEFAULT 0,
  hectares_goal numeric NOT NULL DEFAULT 0,
  hectares_restored numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.campaigns TO anon;
GRANT SELECT ON public.campaigns TO authenticated;
GRANT ALL ON public.campaigns TO service_role;

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Campaigns are publicly viewable"
ON public.campaigns FOR SELECT
TO anon, authenticated
USING (true);

CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  donor_name text NOT NULL DEFAULT 'Anonymous',
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX donations_campaign_id_created_at_idx ON public.donations (campaign_id, created_at DESC);

GRANT SELECT, INSERT ON public.donations TO anon;
GRANT SELECT, INSERT ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Donations are publicly viewable"
ON public.donations FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can donate"
ON public.donations FOR INSERT
TO anon, authenticated
WITH CHECK (amount > 0 AND amount <= 100000);

CREATE OR REPLACE FUNCTION public.apply_donation_to_campaign()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.campaigns c
  SET raised_amount = c.raised_amount + NEW.amount,
      donor_count = c.donor_count + 1,
      hectares_restored = CASE
        WHEN c.goal_amount > 0 THEN LEAST(c.hectares_goal, ROUND(c.hectares_goal * ((c.raised_amount + NEW.amount) / c.goal_amount)))
        ELSE c.hectares_restored
      END,
      updated_at = now()
  WHERE c.id = NEW.campaign_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER donations_apply_to_campaign
AFTER INSERT ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.apply_donation_to_campaign();

ALTER TABLE public.campaigns REPLICA IDENTITY FULL;
ALTER TABLE public.donations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;

INSERT INTO public.campaigns (slug, title, blurb, category, location, emoji, image_focus, goal_amount, hectares_goal, sort_order)
VALUES
  ('mangrove-halong', 'Restore 5,000 Mangrove Saplings', 'Rebuild the coastal forest that shelters juvenile fish and shields fishing villages from storm surges.', 'Oceans', 'Hạ Long Bay', '🌊', 'center 40%', 20000, 120, 1),
  ('saola-pu-mat', 'Protect the Elusive Saola', 'Equip anti-poaching night patrols and expand a camera-trap grid for the rarest large mammal on Earth.', 'Wildlife', 'Pù Mát', '🐾', 'center', 60000, 300, 2),
  ('elephants-yok-don', 'Return 400 Hectares to Elephants', 'Secure protected corridor so rescued Asian elephants can forage, roam, and live in a real wild home.', 'Forests', 'Yok Đôn', '🐘', 'center 55%', 400000, 400, 3);