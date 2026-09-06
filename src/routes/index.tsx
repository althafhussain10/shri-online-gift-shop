import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Cake, Heart, Gift, Baby, Sparkles, MessageCircle, ShieldCheck, Truck, PackageCheck, Star } from "lucide-react";

import logo from "@/assets/shri-logo.jpg";
import banner from "@/assets/shri-banner-themed.jpg";
import { BRAND, CATEGORIES, whatsappLink } from "@/lib/brand";
import { fetchProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SHRI Online Gift Shop Erode | Gifts That Create Memories" },
      {
        name: "description",
        content:
          "Birthday, anniversary, surprise and kids gifts in Erode. Order on WhatsApp 9042770400 from SHRI Online Gift Shop.",
      },
      { property: "og:title", content: "SHRI Online Gift Shop Erode" },
      {
        property: "og:description",
        content: "Premium gifts for every occasion in Erode. WhatsApp ordering available.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const categoryIcons = {
  Birthday: Cake,
  Anniversary: Heart,
  Surprise: Sparkles,
  Kids: Baby,
  "All Occasion": Gift,
} as const;

const promises = [
  { icon: ShieldCheck, label: "Premium quality" },
  { icon: Truck, label: "Fast delivery" },
  { icon: PackageCheck, label: "Safe packaging" },
  { icon: Star, label: "100% satisfaction" },
];

function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const featured = products.slice(0, 8);
  const wa = whatsappLink(BRAND.phones[0]!, `Hello ${BRAND.name}, I'd like to order a gift.`);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="navy-panel border-b border-gold/25 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-gold/30 shadow-xl">
          <img
            src={banner}
            alt="SHRI Online Gift Shop Erode — gifts, god idols, home décor and customised gifts, WhatsApp order 9042770400"
            className="block w-full object-cover"
            width={1220}
            height={768}
            loading="eager"
          />
        </div>
      </section>

      <section className="navy-panel relative overflow-hidden text-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
          <div className="rise">
            <p className="text-xs uppercase tracking-[0.35em] text-gold-soft/80">
              Erode · Since day one
            </p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              <span className="gold-text">Gifts that create</span>
              <br />
              memories
            </h1>
            <div className="gold-rule my-6 max-w-sm" />
            <p className="max-w-md text-cream/75">
              Handpicked gifts, god idols, home décor and fully customised keepsakes — wrapped in
              navy and gold, delivered with love from {BRAND.city}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-navy-deep hover:bg-gold-soft"
              >
                <Link to="/shop">Browse gifts</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              >
                <a href={wa} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp order
                </a>
              </Button>
            </div>
            <p className="mt-5 text-sm text-gold-soft/90">
              {BRAND.phones.join("  ·  ")}
            </p>
          </div>

          <div className="rise flex justify-center">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gold/15 blur-2xl" />
              <img
                src={logo}
                alt="SHRI Online Gift Shop gift box logo"
                className="relative w-64 rounded-3xl object-cover shadow-2xl ring-1 ring-gold/40 sm:w-80"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 bg-navy-deep/60">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 text-xs sm:grid-cols-4 md:px-6 md:text-sm">
            {promises.map((p) => (
              <div key={p.label} className="flex min-w-0 items-center gap-2">
                <p.icon className="h-4 w-4 shrink-0 text-gold" />
                <span className="truncate text-cream/85">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <header className="text-center">
          <h2 className="font-display text-3xl text-navy sm:text-4xl">Shop by occasion</h2>
          <div className="gold-rule mx-auto my-4 w-40" />
          <p className="text-muted-foreground">All types of gifts for every occasion</p>
        </header>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => {
            const Icon = categoryIcons[c];
            return (
              <Link
                key={c}
                to="/shop"
                search={{ category: c }}
                className="lift group flex flex-col items-center gap-3 rounded-2xl border border-gold/30 bg-card p-6 text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full navy-panel ring-1 ring-gold/40">
                  <Icon className="h-6 w-6 text-gold" />
                </span>
                <span className="text-sm font-medium text-navy">{c} Gifts</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-accent/40 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-navy sm:text-4xl">Featured gifts</h2>
              <div className="gold-rule mt-3 w-32" />
            </div>
            <Link to="/shop" className="text-sm font-medium text-navy underline-offset-4 hover:underline">
              View all products →
            </Link>
          </header>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
                ))
              : featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {!isLoading && featured.length === 0 && (
            <p className="mt-10 text-center text-muted-foreground">
              New gifts are being added shortly. Message us on WhatsApp for today's collection.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="navy-panel rounded-3xl border border-gold/30 px-6 py-12 text-center text-cream">
          <h2 className="font-display text-3xl gold-text sm:text-4xl">WhatsApp order available</h2>
          <p className="mx-auto mt-3 max-w-lg text-cream/75">
            Send us the gift you like along with the quantity — we'll confirm price, packing and
            delivery right away.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {BRAND.phones.map((p) => (
              <Button
                key={p}
                asChild
                size="lg"
                className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
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
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
