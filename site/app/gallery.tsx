"use client"

import { BookOpen, Calendar, Database, LayoutDashboard, ListTodo, Plus, Search, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import {
  AdminShell,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  Input,
  LogoMark,
  MetricCard,
  PageHero,
  PageToolbar,
  RuledHeading,
  Section,
  SectionHeading,
  SegmentedControl,
  SiteFooter,
  SiteHeader,
  Skeleton,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
  Wordmark,
  cn,
  type BadgeTone,
} from "@aisocratic/design"
import { Checkbox } from "@aisocratic/design/components/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@aisocratic/design/components/dialog"
import { Label } from "@aisocratic/design/components/label"
import { MobileMenu } from "@aisocratic/design/components/mobile-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@aisocratic/design/components/popover"
import { Progress } from "@aisocratic/design/components/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@aisocratic/design/components/select"
import { Switch } from "@aisocratic/design/components/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aisocratic/design/components/tabs"
import { ThemeToggle } from "@aisocratic/design/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@aisocratic/design/components/tooltip"

import { AuthDemo, FormDemo, TableDemo } from "./demos"

export type ColorRow = { role: string; ref: string; light: string; dark: string; contrast: { light: number; dark: number } | null }
export type PaletteScale = { name: string; steps: { step: string; hex: string }[] }
export type TypeRow = { name: string; px: string; css: string; lineHeight: number; note: string }

/* Class names spelled out so Tailwind sees them in this file. */
const STEP_CLASS: Record<string, string> = {
  micro: "text-micro",
  body: "text-body",
  lead: "text-lead",
  title: "text-title",
  section: "text-section",
  page: "text-page",
  display: "text-display",
  hero: "text-hero",
  mega: "text-mega",
}
const TONES: BadgeTone[] = ["success", "warning", "caution", "danger", "info", "highlight", "accent", "neutral"]

const NAV = [
  { href: "#type", label: "Type" },
  { href: "#colour", label: "Colour" },
  { href: "#shape", label: "Shape" },
  { href: "#components", label: "Components" },
  { href: "#admin", label: "Admin" },
  { href: "#tables", label: "Tables" },
  { href: "#forms", label: "Forms" },
  { href: "#auth", label: "Auth" },
]

const REPO = "https://github.com/aisocratic/stoa"

/* lucide 1.x ships no brand marks. */
function Github({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  )
}

function Swatch({ hex, className }: { hex: string; className?: string }) {
  return (
    <span
      className={cn("inline-block size-5 rounded-md border border-border align-middle", className)}
      style={{ background: hex }}
      aria-hidden
    />
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-eyebrow text-muted-foreground">{children}</p>
}

/* ------------------------------------------------------------ components */

function ComponentPanel({ mode }: { mode: "light" | "dark" }) {
  return (
    <div data-testid={`${mode}-panel`} className={cn(mode, "space-y-8 rounded-xl border border-border bg-background p-6 text-foreground")}>
      <Eyebrow>{mode}</Eyebrow>

      <div className="space-y-3">
        <Eyebrow>Buttons</Eyebrow>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Primary</Button>
          <Button variant="cta">Call to action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button loading>Saving</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-3">
        <Eyebrow>Badges</Eyebrow>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} shape="pill">
              {tone}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4 p-4">
          <p className="font-display text-title">A card</p>
          <div className="space-y-1.5">
            <Label htmlFor={`${mode}-email`}>Email</Label>
            <Input id={`${mode}-email`} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${mode}-note`}>Note</Label>
            <Textarea id={`${mode}-note`} placeholder="Optional" rows={2} />
          </div>
          <Select>
            <SelectTrigger aria-label="Chapter">
              <SelectValue placeholder="Choose a chapter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nyc">New York</SelectItem>
              <SelectItem value="mil">Milan</SelectItem>
              <SelectItem value="mad">Madrid</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-6">
            <label htmlFor={`${mode}-remember`} className="flex items-center gap-2 text-body">
              <Checkbox id={`${mode}-remember`} defaultChecked /> Remember me
            </label>
            <label htmlFor={`${mode}-alerts`} className="flex items-center gap-2 text-body">
              <Switch id={`${mode}-alerts`} defaultChecked /> Alerts
            </label>
          </div>
          <Progress value={62} aria-label="Progress" />
        </Card>

        <div className="space-y-4">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>Three text roles, and only three.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Status tones, from the same seven tokens as the badges.</AlertDescription>
          </Alert>
          <Tabs defaultValue="board">
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="graph">Graph</TabsTrigger>
            </TabsList>
            <TabsContent value="board" className="text-body text-muted-foreground">
              Cards, columns, drag to move.
            </TabsContent>
            <TabsContent value="focus" className="text-body text-muted-foreground">
              One lane at a time.
            </TabsContent>
            <TabsContent value="graph" className="text-body text-muted-foreground">
              Dependencies as a DAG.
            </TabsContent>
          </Tabs>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>A dialog</DialogTitle>
                  <DialogDescription>Radix, rendered through the package's client boundary.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button>Done</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="text-body">Anchored content.</PopoverContent>
            </Popover>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Hover, focus, done.</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" onClick={() => toast.success("Saved")}>
              Toast
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Spinner size="sm" /> <Skeleton className="h-4 w-40" /> <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Fable 5.1</TableCell>
            <TableCell className="text-right font-code">92.4</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Opus 5</TableCell>
            <TableCell className="text-right font-code">89.1</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <EmptyState variant="panel" title="Nothing here yet" action={<Button size="sm">Create one</Button>}>
        The empty state, one component instead of twenty.
      </EmptyState>
    </div>
  )
}

/* ------------------------------------------------------------------ admin */

const ADMIN_GROUPS = [
  {
    label: null,
    items: [
      { href: "#admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "#admin-users", label: "Users", icon: Users },
      { href: "#admin-events", label: "Events", icon: Calendar },
      { href: "#admin-blog", label: "Articles", icon: BookOpen },
    ],
  },
  {
    label: "Dev",
    items: [
      { href: "#admin-todo", label: "Todo", icon: ListTodo },
      { href: "#admin-data", label: "Data", icon: Database },
    ],
  },
]

const ROWS = [
  ["AI Socratic Milan #12", "Milan", "Published", "success", 184],
  ["Frontier Stack: Agents", "New York", "Draft", "neutral", 0],
  ["Open Weight War", "Madrid", "Review", "warning", 42],
  ["Cafés — May", "Berlin", "Cancelled", "danger", 0],
] as const

function AdminDemo() {
  const [view, setView] = useState<"all" | "upcoming" | "past">("all")
  return (
    <div data-testid="admin-demo" className="h-[640px] overflow-hidden rounded-xl border border-border">
      <AdminShell
        embedded
        brand={<Wordmark height={40} />}
        brandCompact={<LogoMark size={32} />}
        groups={ADMIN_GROUPS}
        activeHref="#admin-events"
        topBar="Admin"
        footer={(compact) => (
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-micro font-code">FU</span>
            {!compact ? <span className="text-body text-muted-foreground">fed</span> : null}
          </div>
        )}
      >
        <div className="space-y-6">
          <Breadcrumbs
            items={[{ label: "Events", href: "#admin-events" }, { label: "Venues", href: "#admin-events" }, { label: "Talent Garden" }]}
          />
          <PageToolbar
            nav={
              <SegmentedControl
                aria-label="Events view"
                value={view}
                onValueChange={setView}
                options={[
                  { value: "all", label: "All" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "past", label: "Past" },
                ]}
              />
            }
            filters={
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search events" className="w-56 pl-8" aria-label="Search events" />
              </div>
            }
            meta={<span className="font-code text-micro text-muted-foreground">4 events</span>}
            actions={
              <Button size="sm">
                <Plus /> New event
              </Button>
            }
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Upcoming" value="12" />
            <MetricCard label="Registrations" value="1,284" trailing={<Badge tone="success">+8%</Badge>} />
            <MetricCard label="Attendance" value="71%" />
          </div>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Guests</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ROWS.map(([name, chapter, status, tone, guests]) => (
                  <TableRow key={name}>
                    <TableCell className="text-foreground">{name}</TableCell>
                    <TableCell className="text-muted-foreground">{chapter}</TableCell>
                    <TableCell>
                      <Badge tone={tone}>{status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-code">{guests}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </AdminShell>
    </div>
  )
}

/* ---------------------------------------------------------------- gallery */

export function Gallery({
  colors,
  aliases,
  scales,
  type,
}: {
  colors: ColorRow[]
  aliases: { alias: string; role: string }[]
  scales: PaletteScale[]
  type: TypeRow[]
}) {
  return (
    <>
      <SiteHeader
        brand={
          <a href="#top" aria-label="AI Socratic Design home" className="flex items-center gap-2 text-foreground">
            <Wordmark height={32} />
            <span className="font-body text-body text-muted-foreground">/ design</span>
          </a>
        }
        links={NAV}
        actions={
          <>
            <Button asChild variant="ghost" size="icon" aria-label="GitHub">
              <a href={REPO}>
                <Github />
              </a>
            </Button>
            <ThemeToggle />
          </>
        }
        menu={
          <>
            <ThemeToggle />
            <MobileMenu
              items={NAV}
              footer={
                <a href={REPO} className="text-body text-muted-foreground hover:text-foreground">
                  GitHub
                </a>
              }
            />
          </>
        }
      />

      <main id="top" className="min-h-screen">
        <Section lead size="lg">
          <PageHero
            eyebrow="Design system"
            title="AI Socratic Design"
            subtitle="The tokens, type and primitives shared by aisocratic.org, Agora and Atlas — one package, one version to bump."
            actions={
              <>
                <Button asChild variant="cta" size="lg">
                  <a href={`${REPO}#adopting-it`}>Adopt it</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href={`${REPO}/blob/main/docs/adopting.md`}>@aisocratic/design</a>
                </Button>
              </>
            }
          />
          <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-3">
            <MetricCard label="Palette" value={`${scales.reduce((n, s) => n + s.steps.length, 0) + 1} colours`} />
            <MetricCard label="Roles" value={`${colors.length} + ${aliases.length}`} />
            <MetricCard label="Radii" value="2" />
          </div>
        </Section>

        <Section id="type" size="md" divider>
          <SectionHeading
            eyebrow="Type"
            title="Nine steps, one scale"
            subtitle="A golden-ratio ladder anchored at 14px. The top six are fluid between 390px and 1440px. Each step owns its line-height."
          />
          <div className="space-y-6">
            {type.map((row) => (
              <div key={row.name} className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
                <div className="font-code text-micro text-muted-foreground">
                  text-{row.name}
                  <br />
                  {row.px}px · {row.lineHeight}
                </div>
                <p data-testid={`step-${row.name}`} className={cn(STEP_CLASS[row.name], "truncate font-display text-foreground")}>
                  The quick brown fox jumps over the lazy dog
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card className="p-4">
              <Eyebrow>font-body</Eyebrow>
              <p className="mt-2 font-body text-lead">Space Grotesk — running text, UI, and the header navigation.</p>
              <p data-testid="nav-sample" className="mt-3 text-nav text-foreground/50">
                Events · Blog · News · About
              </p>
            </Card>
            <Card className="p-4">
              <Eyebrow>font-display</Eyebrow>
              <p className="mt-2 font-display text-lead">Newsreader 200 — headings. Hierarchy from size, never weight.</p>
              <p className="mt-3 font-display text-lead italic text-muted-foreground">
                The app fills the slot; aisocratic.org fills it with its own face.
              </p>
            </Card>
            <Card className="p-4">
              <Eyebrow>font-code</Eyebrow>
              <p className="mt-2 font-code text-lead">JetBrains Mono — code and technical values.</p>
              <p className="mt-3 text-eyebrow font-code text-muted-foreground">text-eyebrow · 11px · 0.14em</p>
            </Card>
          </div>
        </Section>

        <Section id="colour" size="md" divider>
          <SectionHeading
            eyebrow="Colour"
            title="A palette, then roles"
            subtitle="Every hex lives once in the palette. Only the roles become classes, and each role points at a palette entry per mode — so two roles that share a job cannot drift apart."
          />
          <div className="space-y-6">
            {scales.map((scale) => (
              <div key={scale.name} className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-center">
                <p className="font-code text-micro text-muted-foreground">{scale.name}</p>
                <div className="flex overflow-hidden rounded-md border border-border">
                  {scale.steps.map((s) => (
                    <div
                      key={s.step}
                      className="flex h-12 flex-1 items-end justify-center"
                      style={{ background: s.hex }}
                      title={`${scale.name}.${s.step} ${s.hex}`}
                    >
                      <span
                        className="pb-1 font-code text-micro"
                        style={{
                          color: scale.name === "ink" ? "#e6e6e6" : "#1f1d18",
                          mixBlendMode: "difference",
                          filter: "invert(1) grayscale(1) contrast(9)",
                        }}
                      >
                        {s.step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Palette</TableHead>
                  <TableHead>Light</TableHead>
                  <TableHead>Dark</TableHead>
                  <TableHead className="text-right">Contrast</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colors.map((row) => (
                  <TableRow key={row.role}>
                    <TableCell className="font-code text-micro">--{row.role}</TableCell>
                    <TableCell className="font-code text-micro text-muted-foreground">{row.ref}</TableCell>
                    <TableCell className="font-code text-micro">
                      <Swatch hex={row.light} /> {row.light}
                    </TableCell>
                    <TableCell className="font-code text-micro">
                      <Swatch hex={row.dark} /> {row.dark}
                    </TableCell>
                    <TableCell className="text-right font-code text-micro text-muted-foreground">
                      {row.contrast ? `${row.contrast.light}:1 · ${row.contrast.dark}:1` : ""}
                    </TableCell>
                  </TableRow>
                ))}
                {aliases.map((a) => (
                  <TableRow key={a.alias}>
                    <TableCell className="font-code text-micro text-muted-foreground">--{a.alias}</TableCell>
                    <TableCell className="font-code text-micro text-muted-foreground" colSpan={4}>
                      alias of --{a.role}, for shadcn output
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>

        <Section id="shape" size="md" divider>
          <SectionHeading
            eyebrow="Shape"
            title="Two radii, one measure"
            subtitle="A control is 10px, a surface is 16px, a pill is full. Every other Tailwind radius name lands on one of them. Cards are border, not shadow. The page-shell is 72rem plus a gutter added on top."
          />
          <div className="flex flex-wrap items-end gap-8">
            <div className="text-center">
              <div className="flex size-24 items-center justify-center rounded-md border border-border bg-card font-code text-micro text-muted-foreground">
                control
              </div>
              <p className="mt-2 font-code text-micro text-muted-foreground">rounded-md · 10</p>
            </div>
            <div className="text-center">
              <div className="flex size-24 items-center justify-center rounded-xl border border-border bg-card font-code text-micro text-muted-foreground">
                surface
              </div>
              <p className="mt-2 font-code text-micro text-muted-foreground">rounded-xl · 16</p>
            </div>
            <div className="text-center">
              <div className="flex size-24 items-center justify-center rounded-full border border-border bg-card font-code text-micro text-muted-foreground">
                pill
              </div>
              <p className="mt-2 font-code text-micro text-muted-foreground">rounded-full</p>
            </div>
            <div className="text-center">
              <div className="flex size-24 items-center justify-center">
                <LogoMark size={64} />
              </div>
              <p className="mt-2 font-code text-micro text-muted-foreground">LogoMark</p>
            </div>
          </div>
        </Section>

        <Section id="components" size="md" divider>
          <RuledHeading title="Components" />
          <p className="mb-8 max-w-[60ch] text-body text-muted-foreground">
            The same components rendered inside a light and a dark ancestor. Nothing changes but the tokens.
          </p>
          <div className="grid gap-6 xl:grid-cols-2">
            <ComponentPanel mode="light" />
            <ComponentPanel mode="dark" />
          </div>
        </Section>

        <Section id="admin" size="md" divider>
          <SectionHeading
            eyebrow="Admin"
            title="The dashboard chrome"
            subtitle="AdminShell, Breadcrumbs, PageToolbar with a SegmentedControl, MetricCard and the table — the pieces every /admin page on aisocratic.org is built from, shipped as one layer."
          />
          <AdminDemo />
        </Section>

        <Section id="tables" size="md" divider>
          <SectionHeading
            eyebrow="Tables"
            title="One list, both archetypes"
            subtitle="DataTable: search, select filters, sortable columns, pinned rows, selection with bulk actions, row actions, expandable sub-rows and pagination — in memory here, or driven by the server with the same props. Delete asks through ConfirmDialog."
          />
          <TableDemo />
        </Section>

        <Section id="forms" size="md" divider>
          <SectionHeading
            eyebrow="Forms"
            title="Fields carry their own chrome"
            subtitle="TextField (prefix, leading icon, multiline), SelectField (plain, searchable, multiple, grouped), ToggleField, ChoiceCard and FilterChip, grouped in FormSection cards. Every field wires its label, description and error."
          />
          <FormDemo />
        </Section>

        <Section id="auth" size="md" divider>
          <SectionHeading
            eyebrow="Sign in"
            title="One window for join and sign in"
            subtitle="AuthScreen is /login on aisocratic.org: the violet field, the pitch, and AuthPanel — a passwordless code flow by default, a magic link or a password if you need one, and any mix of Google, Apple, GitHub, Microsoft, LinkedIn, X or SAML. Use 123456 as the code."
          />
          <AuthDemo />
        </Section>

        <Section size="md" tone="dark" divider>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-section">One package, one version to bump.</h2>
            <p className="mb-8 text-lead text-muted-foreground">
              A dark band is just a themed section: `tone="dark"` puts the `dark` class on it and every token inside follows.
            </p>
            <Button asChild variant="cta" size="lg">
              <a href={`${REPO}#adopting-it`}>Read the adoption guide</a>
            </Button>
          </div>
        </Section>
      </main>

      <SiteFooter
        brand={<Wordmark height={32} />}
        description="The AI Socratic design system, as one package."
        columns={[
          { title: "System", links: NAV.slice(0, 4) },
          {
            title: "Package",
            links: [
              { href: `${REPO}/blob/main/docs/adopting.md`, label: "Install" },
              { href: REPO, label: "GitHub" },
              { href: `${REPO}/blob/main/CHANGELOG.md`, label: "Changelog" },
            ],
          },
          {
            title: "Family",
            links: [
              { href: "https://aisocratic.org", label: "aisocratic.org" },
              { href: "https://aisocratic.github.io/stoa/", label: "Stoa · Design" },
              { href: "https://aisocratic.github.io/agora/", label: "Agora · Community" },
              { href: "https://aisocratic.github.io/atlas/", label: "Atlas · Analytics" },
            ],
          },
        ]}
        copyright="MIT © AI Socratic"
        bottomLinks={[
          { href: "https://aisocratic.org/brand", label: "Brand" },
          { href: `${REPO}/blob/main/LICENSE`, label: "Licence" },
        ]}
        social={
          <a href={REPO} aria-label="GitHub" className="transition-colors hover:text-foreground">
            <Github className="size-[18px]" />
          </a>
        }
      />
    </>
  )
}
