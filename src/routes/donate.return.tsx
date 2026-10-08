import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { confirmVnpayReturn } from "@/lib/payments.functions";

export const Route = createFileRoute("/donate/return")({
  head: () => ({
    meta: [
      { title: "Donation status · Heri-Vest" },
      { name: "description", content: "See the result of your Heri-Vest donation." },
      { property: "og:title", content: "Donation status · Heri-Vest" },
      { property: "og:description", content: "See the result of your Heri-Vest donation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReturnPage,
});

type Result = Awaited<ReturnType<typeof confirmVnpayReturn>>;

function ReturnPage() {
  const confirm = useServerFn(confirmVnpayReturn);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(window.location.search).entries());
    confirm({ data: params })
      .then(setResult)
      .catch(() => setResult({ status: "invalid", amountUsd: null, title: null }));
  }, [confirm]);

  const copy = !result
    ? { h: "Checking your payment…", p: "This only takes a moment." }
    : result.status === "paid"
      ? { h: "Thank you! 🌿", p: `Your $${result.amountUsd?.toLocaleString()} donation to “${result.title}” went through. The progress bar has already moved.` }
      : result.status === "failed"
        ? { h: "Payment not completed", p: "No money was taken. You can try again any time." }
        : { h: "We couldn't confirm this payment", p: "If money was taken, it will be confirmed shortly. Otherwise, please try again." };

  return (
    <div className="mx-auto grid min-h-screen max-w-lg place-items-center px-6 text-center">
      <div className="rounded-3xl border border-border bg-card p-10 shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-jungle">{copy.h}</h1>
        <p className="mt-3 text-muted-foreground">{copy.p}</p>
        <Link to="/" className="mt-6 inline-block rounded-full bg-jungle px-6 py-3 font-semibold text-cream">
          Back to projects
        </Link>
      </div>
    </div>
  );
}
