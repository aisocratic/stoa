"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  LogoMark,
  PageHero,
  RuledHeading,
  Section,
  SectionHeading,
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
} from "@aisocratic/stoa"
import { Checkbox } from "@aisocratic/stoa/components/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@aisocratic/stoa/components/dialog"
import { Label } from "@aisocratic/stoa/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@aisocratic/stoa/components/popover"
import { Progress } from "@aisocratic/stoa/components/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@aisocratic/stoa/components/select"
import { Switch } from "@aisocratic/stoa/components/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@aisocratic/stoa/components/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@aisocratic/stoa/components/tooltip"

export type ColorRow = { role: string; light: string; dark: string; contrast: { light: number; dark: number } | null }
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
const RADII = [
  ["rounded-sm", "6"],
  ["rounded-lg", "10 · base"],
  ["rounded-xl", "16"],
  ["rounded-2xl", "26"],
] as const
const TONES: BadgeTone[] = ["success", "warning", "caution", "danger", "info", "highlight", "accent", "neutral"]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <span className="size-8" />
  const dark = resolvedTheme === "dark"
  return (
    <Button variant="ghost" size="icon" aria-label={dark ? "Switch to light" : "Switch to dark"} onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <Sun /> : <Moon />}
    </Button>
  )
}

function Swatch({ hex }: { hex: string }) {
  return <span className="inline-block size-5 rounded-sm border border-border align-middle" style={{ background: hex }} aria-hidden />
}

function ComponentPanel({ mode }: { mode: "light" | "dark" }) {
  return (
    <div data-testid={`${mode}-panel`} className={cn(mode, "bg-background text-foreground rounded-2xl border border-border p-6 space-y-8")}>
      <p className="text-micro uppercase tracking-[0.14em] text-muted-foreground">{mode}</p>

      <div className="space-y-3">
        <p className="text-micro uppercase tracking-[0.14em] text-muted-foreground">Buttons</p>
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
        <p className="text-micro uppercase tracking-[0.14em] text-muted-foreground">Badges</p>
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
        <Card className="p-4 space-y-4">
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
            <label className="flex items-center gap-2 text-body">
              <Checkbox defaultChecked /> Remember me
            </label>
            <label className="flex items-center gap-2 text-body">
              <Switch defaultChecked /> Alerts
            </label>
          </div>
          <Progress value={62} aria-label="Progress" />
        </Card>

        <div className="space-y-4">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>Three text roles, and only three.</AlertDescription>
          </Alert>
          <Tabs defaultValue="board">
            <TabsList>
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="focus">Focus</TabsTrigger>
              <TabsTrigger value="graph">Graph</TabsTrigger>
            </TabsList>
            <TabsContent value="board" className="text-body text-muted-foreground">Cards, columns, drag to move.</TabsContent>
            <TabsContent value="focus" className="text-body text-muted-foreground">One lane at a time.</TabsContent>
            <TabsContent value="graph" className="text-body text-muted-foreground">Dependencies as a DAG.</TabsContent>
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

export function Gallery({ colors, type }: { colors: ColorRow[]; type: TypeRow[] }) {
  return (
    <main className="min-h-screen">
      <header className="page-shell flex items-center justify-between py-6">
        <Wordmark height={28} />
        <div className="flex items-center gap-3">
          <a className="text-body text-muted-foreground hover:text-foreground" href="https://github.com/aisocratic/stoa">
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </header>

      <Section size="md">
        <PageHero
          eyebrow="Design system"
          title="Stoa"
          subtitle="The tokens, type and primitives shared by aisocratic.org, Agora and Atlas — one package, one version to bump."
          actions={
            <>
              <Button asChild variant="cta" size="lg">
                <a href="https://github.com/aisocratic/stoa#adopting-it">Adopt it</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="https://www.npmjs.com/package/@aisocratic/stoa">@aisocratic/stoa</a>
              </Button>
            </>
          }
        />
      </Section>

      <Section size="md" divider>
        <SectionHeading eyebrow="Type" title="Nine steps, one scale" subtitle="A golden-ratio ladder anchored at 14px. The top six are fluid between 390px and 1440px. Each step owns its line-height." />
        <div className="space-y-6">
          {type.map((row) => (
            <div key={row.name} className="grid gap-2 md:grid-cols-[8rem_1fr] md:items-baseline">
              <div className="font-code text-micro text-muted-foreground">
                text-{row.name}
                <br />
                {row.px}px · {row.lineHeight}
              </div>
              <p data-testid={`step-${row.name}`} className={cn(STEP_CLASS[row.name], "font-display text-foreground truncate")}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card className="p-4">
            <p className="text-micro uppercase tracking-[0.14em] text-muted-foreground mb-2">font-body</p>
            <p className="font-body text-lead">Space Grotesk — running text and UI.</p>
          </Card>
          <Card className="p-4">
            <p className="text-micro uppercase tracking-[0.14em] text-muted-foreground mb-2">font-display</p>
            <p className="font-display text-lead">Newsreader 200 — headings. Hierarchy from size, never weight.</p>
          </Card>
          <Card className="p-4">
            <p className="text-micro uppercase tracking-[0.14em] text-muted-foreground mb-2">font-code</p>
            <p className="font-code text-lead">JetBrains Mono — code and CLI chrome.</p>
          </Card>
        </div>
      </Section>

      <Section size="md" divider>
        <SectionHeading eyebrow="Colour" title="Roles, not hues" subtitle="Every colour is a role that answers differently in light and dark. Ratios are against the page ground." />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Light</TableHead>
                <TableHead>Dark</TableHead>
                <TableHead className="text-right">Contrast</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colors.map((row) => (
                <TableRow key={row.role}>
                  <TableCell className="font-code text-micro">--{row.role}</TableCell>
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
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section size="md" divider>
        <SectionHeading eyebrow="Shape" title="Four radii, one measure" subtitle="A φ ladder anchored on 10px. Cards are border, not shadow. The page-shell is 72rem plus a gutter added on top." />
        <div className="flex flex-wrap gap-6">
          {RADII.map(([cls, label]) => (
            <div key={cls} className="text-center">
              <div className={cn(cls, "size-24 border border-border bg-card")} />
              <p className="mt-2 font-code text-micro text-muted-foreground">
                {cls} · {label}
              </p>
            </div>
          ))}
          <div className="text-center">
            <div className="flex size-24 items-center justify-center">
              <LogoMark size={64} />
            </div>
            <p className="mt-2 font-code text-micro text-muted-foreground">LogoMark</p>
          </div>
        </div>
      </Section>

      <Section size="md" divider>
        <RuledHeading title="Components" />
        <p className="text-body text-muted-foreground mb-8 max-w-[60ch]">The same components rendered inside a light and a dark ancestor. Nothing changes but the tokens.</p>
        <div className="grid gap-6 xl:grid-cols-2">
          <ComponentPanel mode="light" />
          <ComponentPanel mode="dark" />
        </div>
      </Section>

      <footer className="page-shell border-t border-border py-10 flex flex-wrap items-center justify-between gap-4">
        <span className="text-body text-muted-foreground">MIT © AI Socratic</span>
        <span className="font-code text-micro text-muted-foreground">Space Grotesk · Newsreader · JetBrains Mono, all OFL, loaded by the app.</span>
      </footer>
    </main>
  )
}
