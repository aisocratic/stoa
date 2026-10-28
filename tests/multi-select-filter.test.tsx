// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

// Radix's popper stalls jsdom for seconds per open popover; see popover-mock.tsx.
vi.mock("../src/components/popover.js", () => import("./popover-mock.js"))

const { MultiSelectFilter } = await import("../src/components/multi-select-filter.js")

afterEach(cleanup)

const options = [
  { value: "it", label: "Italy", count: 3 },
  { value: "milan", label: "Milan", count: 2, depth: 1 },
  { value: "es", label: "Spain", count: 1200 },
]

describe("MultiSelectFilter", () => {
  it("lists counts and nested options, toggles values and clears them all", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiSelectFilter
        triggerLabel="1 place"
        options={options}
        selectedValues={["it"]}
        onChange={onChange}
        clearable
        footer={<button type="button">Restore defaults</button>}
      />,
    )
    await user.click(screen.getByRole("button", { name: "1 place" }))
    const milan = screen.getByRole("checkbox", { name: /Milan/ })
    expect(milan.closest("label")).toHaveStyle({ paddingLeft: "1.75rem" })
    expect(screen.getByRole("checkbox", { name: /Italy/ })).toBeChecked()
    expect(screen.getByRole("checkbox", { name: /Spain/ }).closest("label")).toHaveTextContent("1,200")
    await user.click(milan)
    expect(onChange).toHaveBeenLastCalledWith(["it", "milan"])
    await user.click(screen.getByRole("button", { name: "Clear all" }))
    expect(onChange).toHaveBeenLastCalledWith([])
    expect(screen.getByRole("button", { name: "Restore defaults" })).toBeVisible()
  })

  it("offers no Clear all while nothing is selected, and search keeps selected options visible", async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <MultiSelectFilter triggerLabel="Places" options={options} selectedValues={[]} onChange={vi.fn()} clearable searchable />,
    )
    await user.click(screen.getByRole("button", { name: "Places" }))
    expect(screen.queryByRole("button", { name: "Clear all" })).toBeNull()
    rerender(<MultiSelectFilter triggerLabel="Places" options={options} selectedValues={["es"]} onChange={vi.fn()} clearable searchable />)
    await user.type(screen.getByRole("textbox", { name: "Search…" }), "mil")
    expect(screen.getAllByRole("checkbox").map((box) => box.closest("label")?.textContent)).toEqual(["Milan2", "Spain1,200"])
    await user.clear(screen.getByRole("textbox", { name: "Search…" }))
    await user.type(screen.getByRole("textbox", { name: "Search…" }), "zzz")
    expect(screen.getAllByRole("checkbox")).toHaveLength(1)
  })

  it("says so when nothing matches", async () => {
    const user = userEvent.setup()
    render(<MultiSelectFilter triggerLabel="Places" options={options} selectedValues={[]} onChange={vi.fn()} searchable />)
    await user.click(screen.getByRole("button", { name: "Places" }))
    await user.type(screen.getByRole("textbox", { name: "Search…" }), "zzz")
    expect(screen.getByText("No matches.")).toBeVisible()
  })
})
