// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"

vi.mock("../src/components/popover.js", () => import("./popover-mock.js"))

const listLoaded = vi.fn()
vi.mock("../src/components/searchable-option-list.js", async (importOriginal) => {
  listLoaded()
  return importOriginal()
})

const { SelectField } = await import("../src/components/select-field.js")

// cmdk measures its list.
vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
)
Element.prototype.scrollIntoView ??= () => undefined

afterEach(cleanup)

const options = [
  { value: "mil", label: "Milan", group: "Europe" },
  { value: "nyc", label: "New York", group: "Americas" },
]

describe("SelectField loads the search list on first open", () => {
  it("does not load cmdk to render a searchable select, then searches once opened", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<SelectField searchable label="Chapter" options={options} onValueChange={onValueChange} />)
    expect(listLoaded).not.toHaveBeenCalled()

    await user.click(screen.getByRole("combobox", { name: "Chapter" }))
    await user.click(await screen.findByRole("option", { name: "New York" }))
    expect(listLoaded).toHaveBeenCalledOnce()
    expect(onValueChange).toHaveBeenCalledWith("nyc")
  })
})
