import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "sonner";

import logo from "@/assets/shri-logo.jpg";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In | SHRI Online Gift Shop" },
      { name: "description", content: "Secure admin sign in for SHRI Online Gift Shop, Erode." },
      { property: "og:title", content: "Admin Sign In | SHRI Online Gift Shop" },
      { property: "og:description", content: "Secure shop management access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          toast.success("Account created. Check your email to confirm, then sign in.");
          setMode("signin");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      await supabase.rpc("claim_admin");
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="navy-panel flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gold/30 bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt="SHRI Online Gift Shop logo"
            className="h-16 w-16 rounded-full object-cover ring-1 ring-gold/50"
          />
          <h1 className="mt-4 font-display text-2xl text-navy">Shop admin</h1>
          <div className="gold-rule my-4 w-32" />
          <p className="text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to manage products" : "Create the shop owner account"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-7 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full bg-navy text-cream hover:bg-navy-soft"
          >
            <Lock className="mr-2 h-4 w-4" />
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <Link
          to="/"
          className="mt-4 block text-center text-xs text-muted-foreground hover:text-navy"
        >
          ← Back to shop
        </Link>
      </div>
    </div>
  );
}
