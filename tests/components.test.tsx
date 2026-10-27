// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import axe from "axe-core"
import { useState, type ReactNode } from "react"

import { AdminShell } from "../src/components/admin-shell.js"
import { AuthPanel, type AuthMode } from "../src/components/auth-panel.js"
import { DataTable, type DataColumn } from "../src/components/data-table.js"
import { MetricCard } from "../src/components/metric-card.js"
import { SortableHeaderCell } from "../src/components/table-parts.js"
import { SegmentedControl } from "../src/components/segmented-control.js"
import { SelectField } from "../src/components/select-field.js"

afterEach(cleanup)

type Row = { id: string; name: string; score: number }
const rows: Row[] = [
  { id: "b", name: "Beta", score: 2 },
  { id: "a", name: "Alpha", score: 1 },
]
const columns: DataColumn<Row>[] = [
  { header: "Name", cell: (row) => row.name },
  { header: "Score", cell: (row) => row.score, sortKey: "score", sortValue: (row) => row.score },
]

describe("DataTable", () => {
  it("uses native controls for sorting and row navigation", async () => {
    const user = userEvent.setup()
    render(<DataTable rows={rows} rowKey={(row) => row.id} columns={columns} rowHref={(row) => `/rows/${row.id}`} />)

    await user.click(screen.getByRole("button", { name: "Score" }))
    expect(screen.getByRole("columnheader", { name: "Score" })).toHaveAttribute("aria-sort", "ascending")
    expect(screen.getByRole("link", { name: "Beta" })).toHaveAttribute("href", "/rows/b")
  })

  it("reports server sorting and follows controlled query updates", async () => {
    const onSortChange = vi.fn()
    const { rerender } = render(
      <DataTable
        rows={rows}
        rowKey={(row) => row.id}
        columns={columns}
        server={{ total: 2, page: 1, pageSize: 20, query: "first", onSearch: vi.fn(), onSortChange }}
      />,
    )
    expect(screen.getByRole("textbox", { name: "Search..." })).toHaveValue("first")

    rerender(
      <DataTable
        rows={rows}
        rowKey={(row) => row.id}
        columns={columns}
        server={{ total: 2, page: 1, pageSize: 20, query: "second", onSearch: vi.fn(), onSortChange }}
      />,
    )
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Search..." })).toHaveValue("second"))
    await userEvent.click(screen.getByRole("button", { name: "Score" }))
    expect(onSortChange).toHaveBeenCalledWith("score", "asc")
  })

  it("renders callback row actions as native buttons", async () => {
    const onRowClick = vi.fn()
    render(<DataTable rows={rows} rowKey={(row) => row.id} columns={columns} onRowClick={onRowClick} />)
    await userEvent.click(screen.getByRole("button", { name: "Beta" }))
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })
})

describe("SelectField", () => {
  it("renders removable multi-select chips outside the trigger", async () => {
    const onValuesChange = vi.fn()
    const { container } = render(
      <SelectField
        multiple
        label="Topics"
        values={["design"]}
        onValuesChange={onValuesChange}
        options={[{ value: "design", label: "Design" }]}
      />,
    )
    expect(container.querySelector("button button")).toBeNull()
    await userEvent.click(screen.getByRole("button", { name: "Remove Design" }))
    expect(onValuesChange).toHaveBeenCalledWith([])
  })
})

function AuthHarness() {
  const [mode, setMode] = useState<AuthMode>("join")
  return <AuthPanel variant="card" mode={mode} onModeChange={setMode} onSendCode={() => undefined} onVerifyCode={() => undefined} />
}

describe("AuthPanel", () => {
  it("exposes the mode as pressed buttons instead of incomplete tabs", async () => {
    render(<AuthHarness />)
    const signIn = screen.getByRole("button", { name: "Sign in" })
    expect(screen.queryByRole("tab")).toBeNull()
    await userEvent.click(signIn)
    expect(signIn).toHaveAttribute("aria-pressed", "true")
  })

  it("returns to the email step when its controlled mode changes", async () => {
    const { rerender } = render(
      <AuthPanel variant="card" mode="join" onModeChange={() => undefined} onSendCode={() => undefined} onVerifyCode={() => undefined} />,
    )
    await userEvent.type(screen.getByRole("textbox", { name: "Email address" }), "person@example.com")
    await userEvent.click(screen.getByRole("button", { name: "Continue with email" }))
    await waitFor(() => expect(screen.getByRole("textbox", { name: "6-digit code" })).toBeTruthy())

    rerender(
      <AuthPanel variant="card" mode="signin" onModeChange={() => undefined} onSendCode={() => undefined} onVerifyCode={() => undefined} />,
    )
    await waitFor(() => expect(screen.getByRole("textbox", { name: "Email address" })).toBeTruthy())
  })

  it("has no serious automated accessibility violations", async () => {
    const { container } = render(<AuthHarness />)
    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
    expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([])
  })
})

describe("AdminShell", () => {
  it("traps the mobile drawer and closes it with Escape", async () => {
    const user = userEvent.setup()
    render(
      <AdminShell brand="Brand" groups={[{ label: null, items: [{ href: "/events", label: "Events" }] }]}>
        Content
      </AdminShell>,
    )
    const trigger = screen.getByRole("button", { name: "Open menu" })
    await user.click(trigger)
    expect(screen.getByRole("dialog", { name: "Admin navigation" })).toBeTruthy()
    expect(screen.getByRole("dialog", { name: "Admin navigation" })).not.toHaveAttribute("inert")
    expect(screen.getByRole("link", { name: "Events" })).toHaveFocus()
    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog", { name: "Admin navigation" })).toBeNull()
    expect(document.querySelector("aside")).toHaveAttribute("inert")
    expect(trigger).toHaveFocus()
  })
})

describe("SegmentedControl", () => {
  const sub = {
    "aria-label": "Layout",
    value: "list",
    options: [
      { value: "list", label: "List" },
      { value: "calendar", label: "Calendar" },
    ],
  }

  it("shows a selected segment's second level inline, and only while it is selected", async () => {
    const onSub = vi.fn()
    const { rerender } = render(
      <SegmentedControl
        aria-label="View"
        value="upcoming"
        options={[
          { value: "all", label: "All" },
          { value: "upcoming", label: "Upcoming", sub: { ...sub, onValueChange: onSub } },
        ]}
      />,
    )
    const group = screen.getByRole("group", { name: "Layout" })
    expect(screen.getByRole("button", { name: "List" })).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(screen.getByRole("button", { name: "Calendar" }))
    expect(onSub).toHaveBeenCalledWith("calendar")
    expect(group.parentElement).toContainElement(screen.getByRole("button", { name: "Upcoming" }))

    rerender(
      <SegmentedControl
        aria-label="View"
        value="all"
        options={[
          { value: "all", label: "All" },
          { value: "upcoming", label: "Upcoming", sub },
        ]}
      />,
    )
    expect(screen.queryByRole("group", { name: "Layout" })).toBeNull()
  })

  it("passes prefetch to a link component, never to a plain anchor", () => {
    const Link = ({ prefetch, children, ...props }: { prefetch?: boolean; href: string; children?: ReactNode }) => (
      <a data-prefetch={String(prefetch)} {...props}>
        {children}
      </a>
    )
    const options = [{ value: "tools", label: "Tools", href: "/tools", prefetch: false }]
    const { rerender } = render(<SegmentedControl value="tools" options={options} linkComponent={Link} />)
    expect(screen.getByRole("link", { name: "Tools" })).toHaveAttribute("data-prefetch", "false")
    expect(screen.getByRole("link", { name: "Tools" })).toHaveAttribute("aria-current", "page")
    rerender(<SegmentedControl value="tools" options={options} />)
    expect(screen.getByRole("link", { name: "Tools" })).not.toHaveAttribute("prefetch")
  })
})

describe("SortableHeaderCell", () => {
  it("hides its column from a separate button that never sorts", async () => {
    const onSort = vi.fn()
    const onHide = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <SortableHeaderCell label="Guests" column="guests" sortColumn="date" sortDirection="asc" onSort={onSort} onHide={onHide} />
          </tr>
        </thead>
      </table>,
    )
    expect(screen.getByRole("columnheader", { name: /Guests/ })).toHaveAttribute("aria-sort", "none")
    await userEvent.click(screen.getByRole("button", { name: "Hide column Guests" }))
    expect(onHide).toHaveBeenCalledOnce()
    expect(onSort).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole("button", { name: "Guests" }))
    expect(onSort).toHaveBeenCalledWith("guests")
    expect(document.querySelector("button button")).toBeNull()
  })

  it("renders no hide affordance without onHide", () => {
    render(
      <table>
        <thead>
          <tr>
            <SortableHeaderCell label="Guests" column="guests" sortColumn="guests" sortDirection="desc" onSort={vi.fn()} />
          </tr>
        </thead>
      </table>,
    )
    expect(screen.queryByRole("button", { name: /Hide column/ })).toBeNull()
    expect(screen.getByRole("columnheader")).toHaveAttribute("aria-sort", "descending")
  })
})

describe("MetricCard", () => {
  it("stays a plain block without href", () => {
    render(<MetricCard label="Members" value="1,204" />)
    expect(screen.queryByRole("link")).toBeNull()
  })

  it("becomes one link through the given link component", () => {
    const Link = ({ children, ...props }: { href: string; children?: ReactNode }) => (
      <a data-router="next" {...props}>
        {children}
      </a>
    )
    render(
      <MetricCard
        label="Founders"
        value="38"
        href="/admin/people?role=founder"
        hrefLabel="Founders: view these people"
        linkComponent={Link}
      />,
    )
    const link = screen.getByRole("link", { name: "Founders: view these people" })
    expect(link).toHaveAttribute("href", "/admin/people?role=founder")
    expect(link).toHaveAttribute("data-router", "next")
    expect(link).toHaveTextContent("38")
  })

  it("opens external targets in a new tab with a plain anchor, bar rows included", () => {
    const Link = vi.fn()
    render(<MetricCard label="GA4" value={12} href="https://example.com" external linkComponent={Link} progress={{ percentage: 40 }} />)
    const link = screen.getByRole("link", { name: /GA4/ })
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
    expect(Link).not.toHaveBeenCalled()
  })
})
