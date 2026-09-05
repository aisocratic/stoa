// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import axe from "axe-core"
import { useState } from "react"

import { AdminShell } from "../src/components/admin-shell.js"
import { AuthPanel, type AuthMode } from "../src/components/auth-panel.js"
import { DataTable, type DataColumn } from "../src/components/data-table.js"
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
