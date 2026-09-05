"use client"

import { ArrowRight, X } from "lucide-react"
import { useEffect, useId, useRef, useState, type ComponentType, type CSSProperties, type ElementType, type ReactNode } from "react"

import { providerGlyphs, providerLabels, type ProviderId } from "../brand/provider-glyphs.js"
import { brand } from "../tokens/brand.js"
import { cn } from "../cn.js"
import { Checkbox } from "./checkbox.js"
import { Spinner } from "./spinner.js"

/* ------------------------------------------------------------------ types */

export type AuthMode = "join" | "signin"
export type AuthMethod = "code" | "link" | "password"
export type AuthResult = void | { error?: string }

export type AuthProvider = {
  id: ProviderId | (string & {})
  /** Defaults to the provider's name — "Continue with Google". */
  label?: string
  icon?: ComponentType<{ className?: string }>
}

export interface AuthPanelProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  /** OAuth / SSO buttons, in order. */
  providers?: AuthProvider[]
  onProvider?: (id: string) => Promise<AuthResult> | AuthResult
  /** How email signs in: a 6-digit code (default), a magic link, or a password. */
  method?: AuthMethod
  onSendCode?: (email: string) => Promise<AuthResult> | AuthResult
  onVerifyCode?: (email: string, code: string) => Promise<AuthResult> | AuthResult
  onSendLink?: (email: string) => Promise<AuthResult> | AuthResult
  onPassword?: (input: { email: string; password: string; mode: AuthMode }) => Promise<AuthResult> | AuthResult
  /** Password mode only. */
  forgotHref?: string
  /** An opt-in below the form — the newsletter. Never pre-ticked. */
  optIn?: { label: ReactNode; checked: boolean; onChange: (checked: boolean) => void }
  /** The terms line, e.g. "By continuing you agree to our Terms and Privacy Policy." */
  terms?: ReactNode
  /** `glass` is the aisocratic.org panel over the violet field; `card` is the token surface for a dialog or a page. */
  variant?: "glass" | "card"
  /** Seconds before "Resend code" re-enables. */
  resendAfter?: number
  className?: string
}

/* ------------------------------------------------------------------ styles */

const glass = {
  card: "w-full max-w-[30rem] rounded-xl border border-white/15 bg-gradient-to-br from-white/15 to-white/5 p-8 text-white shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] backdrop-blur-lg",
  muted: "text-white/70",
  faint: "text-white/45",
  toggle: "grid grid-cols-2 gap-1 rounded-md border border-white/15 bg-black/30 p-1",
  option:
    "rounded-md px-3 py-2 text-body text-white/60 transition-colors hover:text-white data-[selected=true]:bg-white/15 data-[selected=true]:text-white",
  input:
    "h-11 w-full rounded-md border border-white/20 bg-black/40 px-3.5 font-body text-body text-white placeholder:text-white/40 outline-none transition focus:border-white/50 focus:ring-2 focus:ring-white/15 aria-invalid:border-red-400/60 disabled:opacity-60",
  submit:
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border-0 font-body text-body font-medium text-white shadow-[0_12px_30px_-12px_rgba(124,58,237,0.9)] transition hover:brightness-110 disabled:opacity-60",
  submitStyle: { background: "linear-gradient(100deg, #7c3aed, #6366f1 55%, #3b82f6)" } as CSSProperties,
  provider:
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 font-body text-body font-medium text-white transition hover:bg-white/10 disabled:opacity-60",
  rule: "bg-white/15",
  error: "text-red-300",
  link: "underline underline-offset-4 hover:text-white/80",
  checkbox:
    "mt-0.5 border-white/30 data-[state=checked]:border-violet-400 data-[state=checked]:bg-violet-500 dark:data-[state=checked]:bg-violet-500",
}

const card = {
  card: "w-full max-w-[30rem] rounded-xl border border-border bg-card p-8 text-foreground",
  muted: "text-muted-foreground",
  faint: "text-muted-foreground/70",
  toggle: "grid grid-cols-2 gap-1 rounded-md border border-border bg-muted p-1",
  option:
    "rounded-md px-3 py-2 text-body text-muted-foreground transition-colors hover:text-foreground data-[selected=true]:bg-background data-[selected=true]:text-foreground data-[selected=true]:shadow-sm",
  input:
    "h-11 w-full rounded-md border border-border bg-secondary px-3.5 font-body text-body text-foreground placeholder:text-muted-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive disabled:opacity-60",
  submit:
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary font-body text-body font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60",
  submitStyle: undefined as CSSProperties | undefined,
  provider:
    "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-border bg-transparent font-body text-body font-medium text-foreground transition hover:bg-secondary disabled:opacity-60",
  rule: "bg-border",
  error: "text-destructive",
  link: "underline underline-offset-4 hover:text-foreground",
  checkbox: "mt-0.5",
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ------------------------------------------------------------------ panel */

/**
 * The join / sign-in panel from aisocratic.org: one window for both, with a
 * Join / Sign in toggle, a passwordless email flow (code or magic link, or a
 * password if you must), and a column of "Continue with …" providers. The
 * panel owns the steps and the loading and error states; the app supplies
 * the handlers and returns `{ error }` to show a message.
 */
export function AuthPanel({
  mode,
  onModeChange,
  providers = [],
  onProvider,
  method = "code",
  onSendCode,
  onVerifyCode,
  onSendLink,
  onPassword,
  forgotHref,
  optIn,
  terms,
  variant = "glass",
  resendAfter = 30,
  className,
}: AuthPanelProps) {
  const s = variant === "glass" ? glass : card
  const [step, setStep] = useState<"email" | "code" | "sent" | "success">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState<false | "email" | string>(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const fieldId = useId()
  const emailRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const mountedRef = useRef(true)

  useEffect(
    () => () => {
      mountedRef.current = false
    },
    [],
  )

  useEffect(() => {
    setStep("email")
    setCode("")
    setError(null)
    setCooldown(0)
  }, [method, mode])

  useEffect(() => {
    const t = setTimeout(() => (step === "email" ? emailRef : codeRef).current?.focus(), 60)
    return () => clearTimeout(t)
  }, [step])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const joining = mode === "join"
  const trimmed = email.trim()

  const run = async (key: string, fn: () => Promise<AuthResult> | AuthResult, then?: () => void) => {
    setLoading(key)
    setError(null)
    try {
      const result = await fn()
      if (!mountedRef.current) return
      if (result && result.error) setError(result.error)
      else then?.()
    } catch (e) {
      if (!mountedRef.current) return
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  const submitEmail = () => {
    if (!EMAIL.test(trimmed)) {
      setError("That doesn't look like an email address — check for typos.")
      return
    }
    if (method === "code") {
      if (!onSendCode) return
      void run(
        "email",
        () => onSendCode(trimmed),
        () => {
          setStep("code")
          setCooldown(resendAfter)
        },
      )
    } else if (method === "link") {
      if (!onSendLink) return
      void run(
        "email",
        () => onSendLink(trimmed),
        () => setStep("sent"),
      )
    } else {
      if (!onPassword) return
      if (password.length < 8) {
        setError("Use at least 8 characters.")
        return
      }
      void run(
        "email",
        () => onPassword({ email: trimmed, password, mode }),
        () => setStep("success"),
      )
    }
  }

  const intro =
    step === "success"
      ? "You're in — setting up your account, one moment."
      : step === "code"
        ? `We emailed a 6-digit code to ${trimmed}.`
        : step === "sent"
          ? `We emailed a sign-in link to ${trimmed}. Open it on this device.`
          : method === "password"
            ? joining
              ? "Create your account with an email and a password."
              : "Sign in with your email and password."
            : joining
              ? "Create your account with an email — no password to remember."
              : method === "code"
                ? "Sign in with your email — we'll send you a 6-digit code."
                : "Sign in with your email — we'll send you a link."

  return (
    <div className={cn(s.card, className)} data-variant={variant}>
      <div className={s.toggle} role="group" aria-label="Join or sign in">
        {(["join", "signin"] as AuthMode[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            data-selected={mode === option}
            onClick={() => onModeChange(option)}
            className={s.option}
          >
            {option === "join" ? "Join" : "Sign in"}
          </button>
        ))}
      </div>

      <p className={cn("mt-5 text-body", s.muted)} role={step === "success" ? "status" : undefined}>
        {intro}
      </p>

      {step === "email" ? (
        <form
          className="mt-5 space-y-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            submitEmail()
          }}
        >
          <label htmlFor={`${fieldId}-email`} className="sr-only">
            Email address
          </label>
          <input
            ref={emailRef}
            id={`${fieldId}-email`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError(null)
            }}
            disabled={loading === "email"}
            aria-invalid={error ? true : undefined}
            className={s.input}
            required
          />
          {method === "password" ? (
            <>
              <label htmlFor={`${fieldId}-password`} className="sr-only">
                Password
              </label>
              <input
                id={`${fieldId}-password`}
                type="password"
                autoComplete={joining ? "new-password" : "current-password"}
                placeholder={joining ? "Choose a password" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading === "email"}
                className={s.input}
                required
              />
            </>
          ) : null}
          {error ? (
            <p role="alert" className={cn("text-micro", s.error)}>
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={loading === "email"} aria-busy={loading === "email"} className={s.submit} style={s.submitStyle}>
            {loading === "email" ? (
              <>
                <Spinner size="sm" /> {method === "password" ? "Signing in..." : "Sending..."}
              </>
            ) : (
              <>
                {method === "password" ? (joining ? "Create account" : "Sign in") : "Continue with email"}
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
          {method === "password" && !joining && forgotHref ? (
            <p className={cn("text-micro", s.faint)}>
              <a href={forgotHref} className={s.link}>
                Forgot your password?
              </a>
            </p>
          ) : null}
        </form>
      ) : null}

      {step === "code" ? (
        <form
          className="mt-5 space-y-3"
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            if (code.length < 6) {
              setError("Enter the 6 digits from the email.")
              return
            }
            if (onVerifyCode)
              void run(
                "email",
                () => onVerifyCode(trimmed, code),
                () => setStep("success"),
              )
          }}
        >
          <label htmlFor={`${fieldId}-code`} className="sr-only">
            6-digit code
          </label>
          <input
            ref={codeRef}
            id={`${fieldId}-code`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, ""))
              if (error) setError(null)
            }}
            disabled={loading === "email"}
            aria-invalid={error ? true : undefined}
            className={cn(s.input, "text-center text-lead tracking-[0.5em]")}
            required
          />
          {error ? (
            <p role="alert" className={cn("text-micro", s.error)}>
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={loading === "email"} aria-busy={loading === "email"} className={s.submit} style={s.submitStyle}>
            {loading === "email" ? "Verifying..." : "Verify code"}
          </button>
          <div className={cn("flex items-center justify-between text-micro", s.muted)}>
            <button
              type="button"
              onClick={() =>
                onSendCode &&
                void run(
                  "resend",
                  () => onSendCode(trimmed),
                  () => setCooldown(resendAfter),
                )
              }
              disabled={loading !== false || cooldown > 0}
              className="underline-offset-4 transition hover:underline disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email")
                setCode("")
                setError(null)
              }}
              disabled={loading !== false}
              className="underline-offset-4 transition hover:underline"
            >
              Use a different email
            </button>
          </div>
        </form>
      ) : null}

      {step === "sent" ? (
        <p className={cn("mt-5 text-micro", s.muted)}>
          Didn&apos;t get it?{" "}
          <button type="button" onClick={() => setStep("email")} className={cn("underline-offset-4 hover:underline", s.link)}>
            Use a different email
          </button>
        </p>
      ) : null}

      {step === "email" && providers.length > 0 ? (
        <>
          <div className="my-5 flex items-center gap-3">
            <span className={cn("h-px flex-1", s.rule)} />
            <span className={cn("text-micro uppercase tracking-[0.2em]", s.faint)}>or</span>
            <span className={cn("h-px flex-1", s.rule)} />
          </div>
          <div className="space-y-2">
            {providers.map((p) => {
              const Icon = p.icon ?? providerGlyphs[p.id as ProviderId]
              const label = p.label ?? providerLabels[p.id as ProviderId] ?? p.id
              const busy = loading === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onProvider && void run(p.id, () => onProvider(p.id))}
                  disabled={loading !== false}
                  aria-busy={busy}
                  className={s.provider}
                >
                  {busy ? (
                    <>
                      <Spinner size="sm" /> Redirecting...
                    </>
                  ) : (
                    <>
                      {Icon ? <Icon className="size-4" /> : null}
                      Continue with {label}
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </>
      ) : null}

      {step === "email" && optIn ? (
        <label className={cn("mt-5 flex cursor-pointer items-start gap-2.5 text-micro", s.muted)}>
          <Checkbox checked={optIn.checked} onCheckedChange={(v) => optIn.onChange(v === true)} className={s.checkbox} />
          <span>{optIn.label}</span>
        </label>
      ) : null}

      {step !== "success" && terms ? <p className={cn("mt-5 text-micro", s.faint)}>{terms}</p> : null}
    </div>
  )
}

/* --------------------------------------------------------------- backdrop */

/**
 * The violet field behind the join panel — cyan-shifted for sign-in. Pure
 * gradients from the brand stops; an app can layer an image under it via
 * `style`.
 */
export function AuthBackdrop({ tone = "join", className, style }: { tone?: AuthMode; className?: string; style?: CSSProperties }) {
  const join = tone === "join"
  const base = join
    ? "linear-gradient(150deg, #1a0b40 0%, #251072 42%, #0e1c5e 76%, #070a22 100%)"
    : "linear-gradient(150deg, #042a3e 0%, #063d5c 42%, #082152 76%, #030a1c 100%)"
  const blobA = join ? brand.gradient.stops[0]!.color : "#22d3ee"
  const blobB = join ? brand.gradient.stops[2]!.color : "#3b82f6"
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ background: base, ...style }}
    >
      <span
        className="absolute -top-[8vmax] -left-[10vmax] size-[55vmax] rounded-full blur-3xl"
        style={{ background: blobA, opacity: 0.45 }}
      />
      <span
        className="absolute -right-[12vmax] -bottom-[14vmax] size-[50vmax] rounded-full blur-3xl"
        style={{ background: blobB, opacity: 0.3 }}
      />
      <span
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 90% at 18% 8%, rgba(255,255,255,0.06) 0%, transparent 58%)" }}
      />
    </div>
  )
}

/* ----------------------------------------------------------------- screen */

export type AuthBenefit = { icon?: ComponentType<{ className?: string }>; title: ReactNode; description: ReactNode }

/**
 * The join / sign-in page: the backdrop, the pitch on the left, the panel
 * on the right, a close button back to the site. This is `/login` on
 * aisocratic.org; the header opens the same thing as an expanding circle.
 */
export function AuthScreen({
  eyebrow = brand.name,
  title,
  description,
  benefits = [],
  note,
  closeHref,
  onClose,
  linkComponent,
  className,
  ...panel
}: AuthPanelProps & {
  eyebrow?: ReactNode
  /** Defaults to "Join the community" / "Welcome back" by mode. */
  title?: ReactNode
  description?: ReactNode
  benefits?: AuthBenefit[]
  /** A closing card under the benefits — "Membership is free, always". */
  note?: ReactNode
  closeHref?: string
  onClose?: () => void
  linkComponent?: ElementType
}) {
  const L = linkComponent ?? "a"
  const joining = panel.mode === "join"
  const closeClass =
    "absolute top-5 right-5 z-10 grid size-10 place-items-center rounded-full border border-white/20 bg-white/5 text-white/70 backdrop-blur transition hover:bg-white/15 hover:text-white sm:top-8 sm:right-8"
  return (
    <div className={cn("relative isolate min-h-screen overflow-hidden text-white", className)}>
      <AuthBackdrop tone={panel.mode} className="-z-10" />
      {closeHref ? (
        <L href={closeHref} aria-label="Close" className={closeClass}>
          <X className="size-5" />
        </L>
      ) : onClose ? (
        <button type="button" onClick={onClose} aria-label="Close" className={closeClass}>
          <X className="size-5" />
        </button>
      ) : null}

      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_minmax(22rem,26rem)] lg:gap-16 lg:py-24">
        <div className="order-2 lg:order-1">
          <p className="text-micro uppercase tracking-[0.3em] text-white/70">{eyebrow}</p>
          <h1 className="mt-4 font-display text-display text-white">{title ?? (joining ? "Join the community" : "Welcome back")}</h1>
          {description ? <p className="mt-4 max-w-md text-body text-white/70">{description}</p> : null}
          {benefits.length ? (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <li key={i} className="rounded-xl border border-white/12 bg-white/5 p-4">
                  {b.icon ? <b.icon className="size-5 text-violet-300" /> : null}
                  <h3 className="mt-3 font-display text-lead text-white">{b.title}</h3>
                  <p className="mt-1 text-micro text-white/60">{b.description}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {note ? (
            <div className="mt-6 rounded-xl border border-white/12 bg-white/5 p-4 text-micro text-white/60 [&_strong]:font-display [&_strong]:text-body [&_strong]:font-normal [&_strong]:text-white">
              {note}
            </div>
          ) : null}
        </div>
        <div className="order-1 lg:order-2">
          <AuthPanel {...panel} variant="glass" className="mx-auto" />
        </div>
      </div>
    </div>
  )
}
