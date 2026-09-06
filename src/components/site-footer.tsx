import { Link } from "@tanstack/react-router";
import { Facebook, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import logo from "@/assets/shri-logo.jpg";
import { BRAND, whatsappLink } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="navy-panel mt-20 border-t border-gold/25 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={logo}
              alt="SHRI Online Gift Shop logo"
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-gold/50"
            />
            <div className="min-w-0">
              <p className="font-display text-xl gold-text">SHRI Online Gift Shop</p>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-soft/70">
                {BRAND.tagline}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-cream/70">
            Thank you for supporting our small business in {BRAND.city}. Every gift is packed with
            care.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-display text-lg text-gold">Visit us</h3>
          <p className="flex gap-3 text-cream/80">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{BRAND.address}</span>
          </p>
          <p className="flex gap-3 text-cream/80">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>{BRAND.handle}</span>
          </p>
          <a
            href={BRAND.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-cream/80 transition-colors hover:text-gold"
          >
            <Facebook className="h-4 w-4 text-gold" /> Follow us on Facebook
          </a>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-display text-lg text-gold">WhatsApp order</h3>
          {BRAND.phones.map((p) => (
            <a
              key={p}
              href={whatsappLink(p, `Hello ${BRAND.name}, I'd like to place an order.`)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg border border-gold/30 px-4 py-2.5 transition-colors hover:bg-gold hover:text-navy-deep"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="font-semibold tracking-wide">{p}</span>
            </a>
          ))}
          <p className="flex gap-3 pt-1 text-cream/70">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>Call us any day, 9 AM – 9 PM</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gold/15 px-4 py-5 text-center text-xs text-cream/55">
        © {new Date().getFullYear()} {BRAND.name}, {BRAND.city}.
      </div>
    </footer>
  );
}
