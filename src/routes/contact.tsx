import { createFileRoute } from "@tanstack/react-router";
import { Facebook, MapPin, MessageCircle, Phone } from "lucide-react";

import { BRAND, whatsappLink } from "@/lib/brand";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Store Address | SHRI Online Gift Shop Erode" },
      {
        name: "description",
        content:
          "Visit SHRI Online Gift Shop at 21 Kamatchi Amman Kovil Street, Karungalpalayam, Erode - 638003. WhatsApp 9042770400.",
      },
      { property: "og:title", content: "Contact SHRI Online Gift Shop, Erode" },
      {
        property: "og:description",
        content: "Store address, phone numbers and WhatsApp ordering details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="navy-panel py-14 text-center text-cream">
        <h1 className="font-display text-4xl gold-text sm:text-5xl">Say hello</h1>
        <div className="gold-rule mx-auto my-4 w-40" />
        <p className="px-4 text-cream/75">{BRAND.tagline}</p>
      </section>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-14 md:grid-cols-2 md:px-6">
        <div className="rounded-2xl border border-border bg-card p-7">
          <h2 className="font-display text-2xl text-navy">Store address</h2>
          <div className="gold-rule my-4" />
          <p className="flex gap-3 text-muted-foreground">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <span>{BRAND.address}</span>
          </p>
          <a
            href={BRAND.facebook}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-navy/25 px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-accent"
          >
            <Facebook className="h-4 w-4" /> Facebook — {BRAND.handle}
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7">
          <h2 className="font-display text-2xl text-navy">Order on WhatsApp</h2>
          <div className="gold-rule my-4" />
          <p className="text-muted-foreground">
            Send the gift name, price and quantity — we reply with availability and delivery.
          </p>
          <div className="mt-6 space-y-3">
            {BRAND.phones.map((p) => (
              <Button
                key={p}
                asChild
                size="lg"
                className="w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              >
                <a
                  href={whatsappLink(p, `Hello ${BRAND.name}, I'd like to place an order.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" /> {p}
                </a>
              </Button>
            ))}
          </div>
          <p className="mt-5 flex gap-3 text-sm text-muted-foreground">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>Calls welcome daily, 9 AM – 9 PM</span>
          </p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
