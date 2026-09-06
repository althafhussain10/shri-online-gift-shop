import { Link } from "@tanstack/react-router";
import { Facebook, MessageCircle, Menu, Instagram } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/shri-logo.jpg";
import { BRAND, whatsappLink } from "@/lib/brand";
import { Button } from "@/components/ui/button";

const nav = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const wa = whatsappLink(
    BRAND.phones[0]!,
    `Hello ${BRAND.name}, I'd like to know more about your gifts.`,
  );

  return (
    <header className="navy-panel sticky top-0 z-50 border-b border-gold/25">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 md:gap-4 md:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <img
            src={logo}
            alt="SHRI Online Gift Shop logo"
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-gold/50 sm:h-11 sm:w-11"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-base leading-tight gold-text sm:text-xl">
              SHRI Online Gift Shop
            </span>
            <span className="block truncate text-[11px] uppercase tracking-[0.25em] text-gold-soft/70">
              {BRAND.city}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-cream/85 transition-colors hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <a
            href={BRAND.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook page"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-navy-deep"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram page"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-colors hover:bg-gold hover:text-navy-deep"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <Button
            asChild
            size="sm"
            className="hidden bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90 sm:inline-flex"
          >
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-gold/40 text-gold md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-gold/20 bg-navy-deep px-4 pb-4 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="block border-b border-gold/10 py-3 text-sm text-cream/85"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block rounded-md bg-whatsapp py-2.5 text-center text-sm font-semibold text-whatsapp-foreground"
          >
            WhatsApp Order
          </a>
        </nav>
      )}
    </header>
  );
}
