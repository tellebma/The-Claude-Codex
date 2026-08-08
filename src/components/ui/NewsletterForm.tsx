"use client";

import { useId, useState } from "react";
import { Mail, Send, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  subscribeEmail,
  type SubscribeOutcome,
} from "@/lib/newsletter/subscribe";

type Variant = "section" | "footer";

interface NewsletterFormProps {
  /** Emplacement visuel — pilote la densite et sert de `source` analytics. */
  readonly variant?: Variant;
}

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; outcome: Extract<SubscribeOutcome, "success" | "already_subscribed"> }
  | { status: "error"; outcome: Exclude<SubscribeOutcome, "success" | "already_subscribed"> };

/**
 * THE-4 — Formulaire de capture newsletter.
 *
 * Persistance cote client vers Supabase (export statique, pas de runtime
 * serveur). Inclut : validation, etats idle/loading/success/error, champ
 * honeypot anti-bot, et zone `aria-live` pour l'accessibilite.
 *
 * Le rendu reste identique que la newsletter soit cablee ou non : si la
 * config Supabase est absente, la soumission renvoie un etat d'erreur
 * propre sans casser la page.
 */
export function NewsletterForm({ variant = "section" }: NewsletterFormProps) {
  const t = useTranslations("newsletter");
  const fieldId = useId();
  const honeypotId = useId();
  const statusId = useId();

  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "loading") {
      return;
    }
    setState({ status: "loading" });

    const result = await subscribeEmail({ email, honeypot, source: variant });

    if (result.outcome === "success" || result.outcome === "already_subscribed") {
      setEmail("");
      setState({ status: "success", outcome: result.outcome });
      return;
    }
    setState({ status: "error", outcome: result.outcome });
  }

  if (state.status === "success") {
    const messageKey =
      state.outcome === "already_subscribed" ? "alreadySubscribed" : "successMessage";
    return (
      <div
        id={statusId}
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] px-5 py-4 text-[color:var(--fg-primary)]"
      >
        <CheckCircle2
          className="h-5 w-5 shrink-0 text-[color:var(--color-success)]"
          aria-hidden="true"
        />
        <div>
          <p className="font-semibold">{t("successTitle")}</p>
          <p className="text-sm text-[color:var(--fg-secondary)]">{t(messageKey)}</p>
        </div>
      </div>
    );
  }

  const isLoading = state.status === "loading";
  const errorMessage =
    state.status === "error" ? t(`errors.${state.outcome}`) : null;

  const containerClass =
    variant === "footer"
      ? "flex flex-col gap-2 sm:flex-row"
      : "flex flex-col gap-3 sm:flex-row";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <div className={containerClass}>
        <label htmlFor={fieldId} className="sr-only">
          {t("emailLabel")}
        </label>
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--fg-muted)]"
            aria-hidden="true"
          />
          <input
            id={fieldId}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            disabled={isLoading}
            aria-describedby={errorMessage ? statusId : undefined}
            aria-invalid={state.status === "error" ? true : undefined}
            className="min-h-[44px] w-full rounded-xl border border-[color:var(--border-default)] bg-[color:var(--bg-elevated)] py-3 pl-9 pr-3 text-[color:var(--fg-primary)] outline-none transition-colors placeholder:text-[color:var(--fg-muted)] focus-visible:border-[color:var(--brand-primary)] focus-visible:[box-shadow:var(--shadow-focus)] disabled:opacity-60"
          />
        </div>

        {/* Honeypot : invisible pour l'humain, piege pour les bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={honeypotId}>{t("honeypotLabel")}</label>
          <input
            id={honeypotId}
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-[color:var(--fg-on-brand)] shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:shadow-brand-500/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </div>

      <p
        id={statusId}
        role={errorMessage ? "alert" : undefined}
        aria-live="polite"
        className="mt-2 min-h-[1.25rem] text-sm text-[color:var(--color-error)]"
      >
        {errorMessage}
      </p>
    </form>
  );
}
