"use client"

import { CalendarDays, Globe2, Link2, Pencil, Sparkles, Trash2, Users } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import {
  Badge,
  Button,
  ChoiceCard,
  FilterChip,
  FilterToolbar,
  FormActions,
  FormSection,
  RowAction,
  RowActions,
  TextField,
  type BadgeTone,
} from "@aisocratic/design"
import { AuthPanel, AuthScreen, type AuthMode, type AuthResult } from "@aisocratic/design/components/auth-panel"
import { ConfirmDialog } from "@aisocratic/design/components/confirm-dialog"
import { DataTable, type DataColumn } from "@aisocratic/design/components/data-table"
import { SelectField } from "@aisocratic/design/components/select-field"
import { ToggleField } from "@aisocratic/design/components/toggle-field"

/* ------------------------------------------------------------------ tables */

type Event = { id: string; name: string; chapter: string; status: string; tone: BadgeTone; guests: number; date: string }

const EVENTS: Event[] = [
  { id: "1", name: "AI Socratic Milan #12", chapter: "Milan", status: "Published", tone: "success", guests: 184, date: "2026-09-18" },
  { id: "2", name: "Frontier Stack: Agents", chapter: "New York", status: "Draft", tone: "neutral", guests: 0, date: "2026-10-02" },
  { id: "3", name: "Open Weight War", chapter: "Madrid", status: "Review", tone: "warning", guests: 42, date: "2026-09-25" },
  { id: "4", name: "Cafés — May", chapter: "Berlin", status: "Cancelled", tone: "danger", guests: 0, date: "2026-05-14" },
  { id: "5", name: "Founders dinner", chapter: "New York", status: "Published", tone: "success", guests: 28, date: "2026-09-30" },
  { id: "6", name: "Eval night", chapter: "Milan", status: "Published", tone: "success", guests: 96, date: "2026-11-06" },
  { id: "7", name: "Robotics lab tour", chapter: "Madrid", status: "Review", tone: "warning", guests: 12, date: "2026-10-21" },
]

const columns: DataColumn<Event>[] = [
  { header: "Event", cell: (e) => <span className="text-foreground">{e.name}</span>, sortKey: "name", sortValue: (e) => e.name },
  {
    header: "Chapter",
    cell: (e) => <span className="text-muted-foreground">{e.chapter}</span>,
    sortKey: "chapter",
    sortValue: (e) => e.chapter,
    hideBelow: "md",
  },
  {
    header: "Date",
    cell: (e) => <span className="font-code text-micro text-muted-foreground">{e.date}</span>,
    sortKey: "date",
    sortValue: (e) => e.date,
    hideBelow: "lg",
  },
  { header: "Status", cell: (e) => <Badge tone={e.tone}>{e.status}</Badge> },
  {
    header: "Guests",
    align: "right",
    cell: (e) => <span className="font-code">{e.guests}</span>,
    sortKey: "guests",
    sortValue: (e) => e.guests,
  },
]

export function TableDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirm, setConfirm] = useState<Event | null>(null)
  const [deleting, setDeleting] = useState(false)
  return (
    <div data-testid="table-demo">
      <DataTable
        rows={EVENTS}
        rowKey={(e) => e.id}
        columns={columns}
        searchText={(e) => `${e.name} ${e.chapter}`}
        searchPlaceholder="Search events"
        filters={[
          {
            key: "chapter",
            allLabel: "All chapters",
            options: ["Milan", "New York", "Madrid", "Berlin"].map((c) => ({ value: c, label: c })),
            predicate: (e, v) => e.chapter === v,
          },
          {
            key: "status",
            allLabel: "All statuses",
            options: ["Published", "Draft", "Review", "Cancelled"].map((s) => ({ value: s, label: s })),
            predicate: (e, v) => e.status === v,
          },
        ]}
        defaultSort={{ key: "date", dir: "desc" }}
        pinFirst={(e) => e.status === "Draft"}
        pageSize={5}
        selectedKeys={selected}
        onSelectionChange={setSelected}
        bulkActions={
          <Button size="sm" variant="outline" onClick={() => toast.success(`Published ${selected.size}`)}>
            Publish
          </Button>
        }
        toolbarActions={<Button size="sm">New event</Button>}
        rowActions={(e) => (
          <RowActions>
            <RowAction icon={Pencil} title="Edit" onClick={() => toast(`Edit ${e.name}`)} />
            <RowAction icon={Trash2} title="Delete" variant="destructive" onClick={() => setConfirm(e)} />
          </RowActions>
        )}
        renderSubRow={(e) =>
          e.status === "Review" ? (
            <p className="px-4 py-2 font-code text-micro text-muted-foreground">Awaiting an editor. Last touched by fed.</p>
          ) : null
        }
        resultNoun="event"
      />
      <ConfirmDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={`Delete “${confirm?.name}”?`}
        description="Guests will be notified. This cannot be undone."
        loading={deleting}
        onConfirm={async () => {
          setDeleting(true)
          await new Promise((r) => setTimeout(r, 600))
          setDeleting(false)
          setConfirm(null)
          toast.success("Deleted")
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------- forms */

const CHAPTERS = [
  { value: "mil", label: "Milan", group: "Europe" },
  { value: "mad", label: "Madrid", group: "Europe" },
  { value: "ber", label: "Berlin", group: "Europe" },
  { value: "nyc", label: "New York", group: "Americas" },
  { value: "sf", label: "San Francisco", group: "Americas" },
]
const TOPICS = ["Agents", "Evals", "Open weights", "Robotics", "Inference"].map((t) => ({ value: t.toLowerCase(), label: t }))

export function FormDemo() {
  const [chapter, setChapter] = useState<string>()
  const [host, setHost] = useState<string>()
  const [topics, setTopics] = useState<string[]>(["agents"])
  const [published, setPublished] = useState(true)
  const [members, setMembers] = useState(false)
  const [kind, setKind] = useState<"meetup" | "workshop" | "dinner">("meetup")
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming")
  const [slug, setSlug] = useState("milan-12")
  const slugError = slug.length < 3 ? "At least 3 characters." : undefined
  return (
    <div data-testid="form-demo" className="space-y-6">
      <FilterToolbar
        filters={
          <>
            {(["all", "upcoming", "past"] as const).map((v) => (
              <FilterChip key={v} shape="pill" selected={filter === v} onClick={() => setFilter(v)}>
                {v[0]!.toUpperCase() + v.slice(1)}
              </FilterChip>
            ))}
          </>
        }
        actions={<FilterChip variant="outline">Export</FilterChip>}
        className="mb-0"
      />
      <FormSection title="Event details" subtitle="What goes on the public page.">
        <TextField label="Title" placeholder="AI Socratic Milan #13" required defaultValue="AI Socratic Milan #13" />
        <TextField label="Slug" prefix="aisocratic.org/events/" value={slug} onChange={(e) => setSlug(e.target.value)} error={slugError} />
        <TextField
          label="Luma link"
          leadingIcon={<Link2 />}
          placeholder="https://lu.ma/…"
          description="Guests register there; we sync the list hourly."
        />
        <SelectField
          label="Chapter"
          options={CHAPTERS}
          value={chapter}
          onValueChange={setChapter}
          placeholder="Choose a chapter"
          required
        />
        <SelectField
          label="Host"
          options={[
            { value: "fed", label: "Federico" },
            { value: "ani", label: "Anissa" },
            { value: "ivo", label: "Ivo" },
          ]}
          value={host}
          onValueChange={setHost}
          searchable
          placeholder="Search members"
        />
        <SelectField label="Topics" options={TOPICS} values={topics} onValuesChange={setTopics} multiple placeholder="Add topics" />
        <TextField label="Description" multiline rows={3} placeholder="One paragraph. It is read, not scanned." className="md:col-span-2" />
      </FormSection>
      <FormSection title="Format" subtitle="One choice." columns={1}>
        <div className="grid gap-3 sm:grid-cols-3">
          <ChoiceCard
            indicator="radio"
            selected={kind === "meetup"}
            onClick={() => setKind("meetup")}
            icon={<Users className="size-4" />}
            title="Meetup"
            description="Talks and mingling, 60–120 people."
          />
          <ChoiceCard
            indicator="radio"
            selected={kind === "workshop"}
            onClick={() => setKind("workshop")}
            icon={<Sparkles className="size-4" />}
            title="Workshop"
            description="Hands-on, 20–30 seats."
          />
          <ChoiceCard
            indicator="radio"
            selected={kind === "dinner"}
            onClick={() => setKind("dinner")}
            icon={<CalendarDays className="size-4" />}
            title="Dinner"
            description="Invite only, one table."
          />
        </div>
      </FormSection>
      <FormSection title="Visibility" columns={1}>
        <ToggleField
          control="switch"
          label="Published"
          description="Listed on /events and in the digest."
          checked={published}
          onCheckedChange={setPublished}
        />
        <ToggleField
          label="Members only"
          description="Hide the registration link from signed-out visitors."
          checked={members}
          onCheckedChange={setMembers}
        />
      </FormSection>
      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button onClick={() => toast.success("Saved")}>Save event</Button>
      </FormActions>
    </div>
  )
}

/* -------------------------------------------------------------------- auth */

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
const ok = async (): Promise<AuthResult> => {
  await wait(700)
}

const handlers = {
  onSendCode: ok,
  onVerifyCode: async (_email: string, code: string): Promise<AuthResult> => {
    await wait(700)
    return code === "123456" ? undefined : { error: "That code didn't match. Try 123456 in this demo." }
  },
  onSendLink: ok,
  onPassword: ok,
  onProvider: async (id: string): Promise<AuthResult> => {
    await wait(700)
    toast(`Would redirect to ${id}`)
  },
}

const BENEFITS = [
  { icon: Users, title: "Community access", description: "A private directory of AI engineers, researchers and founders." },
  { icon: CalendarDays, title: "Exclusive events", description: "Priority access to member-only workshops, meetups and dinners." },
  { icon: Sparkles, title: "Learning resources", description: "Curated content and discussions to stay ahead in AI." },
  { icon: Globe2, title: "Global network", description: "Chapters in New York, Milan and Madrid — and growing." },
]

export function AuthDemo() {
  const [mode, setMode] = useState<AuthMode>("join")
  const [optIn, setOptIn] = useState(false)
  const [cardMode, setCardMode] = useState<AuthMode>("signin")
  return (
    <div className="space-y-8">
      <div data-testid="auth-screen" className="overflow-hidden rounded-xl border border-border [&>div]:min-h-0">
        <AuthScreen
          mode={mode}
          onModeChange={setMode}
          providers={[{ id: "google" }, { id: "apple" }, { id: "github" }]}
          {...handlers}
          optIn={{
            checked: optIn,
            onChange: setOptIn,
            label: "Also email me the weekly AI digest and monthly round-up (unsubscribe any time)",
          }}
          terms={
            <>
              By continuing you agree to our{" "}
              <a href="https://aisocratic.org/terms-of-service" className="underline underline-offset-4">
                Terms
              </a>{" "}
              and{" "}
              <a href="https://aisocratic.org/privacy-policy" className="underline underline-offset-4">
                Privacy Policy
              </a>
              .
            </>
          }
          description="A global community of AI engineers, researchers and founders. Membership is free — and automatic once you attend an event."
          benefits={BENEFITS}
          note={
            <>
              <strong>Membership is free, always</strong>
              <br />
              Create your account, come to an event, and you're a member.
            </>
          }
          closeHref="#auth"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div data-testid="auth-card">
          <p className="text-eyebrow mb-3 text-muted-foreground">card · password · every provider</p>
          <AuthPanel
            variant="card"
            mode={cardMode}
            onModeChange={setCardMode}
            method="password"
            forgotHref="#auth"
            providers={[{ id: "google" }, { id: "microsoft" }, { id: "linkedin" }, { id: "x" }, { id: "sso", label: "SAML SSO" }]}
            {...handlers}
            className="max-w-none"
          />
        </div>
        <div className="dark rounded-xl bg-background p-6 text-foreground">
          <p className="text-eyebrow mb-3 text-muted-foreground">card · magic link · dark</p>
          <AuthPanel
            variant="card"
            mode="signin"
            onModeChange={() => {}}
            method="link"
            providers={[{ id: "github" }]}
            {...handlers}
            className="max-w-none"
          />
        </div>
      </div>
    </div>
  )
}
