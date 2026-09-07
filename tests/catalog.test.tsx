// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { useState } from "react"
import axe from "axe-core"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../src/components/accordion.js"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../src/components/alert-dialog.js"
import { Calendar } from "../src/components/calendar.js"
import { Chart } from "../src/components/chart.js"
import { Carousel } from "../src/components/carousel.js"
import { Questionnaire } from "../src/components/questionnaire.js"
import { TagInput } from "../src/components/tag-input.js"
import { InputOTP } from "../src/components/input-otp.js"
import { FileUpload } from "../src/components/file-upload.js"
import { TaskCard } from "../src/components/task-card.js"
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group.js"
import { Slider } from "../src/components/slider.js"

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  )
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("new catalog interactions", () => {
  it("opens accordion sections by keyboard and moves focus between headers", async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible>
        {["One", "Two"].map((name) => (
          <AccordionItem key={name} value={name}>
            <AccordionTrigger>{name}</AccordionTrigger>
            <AccordionContent>{name} content</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>,
    )
    await user.tab()
    await user.keyboard("{Enter}")
    expect(screen.getByText("One content")).toBeVisible()
    await user.keyboard("{ArrowDown}{Enter}")
    expect(screen.getByText("Two content")).toBeVisible()
    expect(screen.queryByText("One content")).not.toBeInTheDocument()
  })
  it("keeps confirmation focus on cancel and restores the trigger on escape", async () => {
    const user = userEvent.setup()
    const confirm = vi.fn()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Archive</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Archive task?</AlertDialogTitle>
          <AlertDialogDescription>Move it out of the active list.</AlertDialogDescription>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    )
    await user.click(screen.getByText("Archive"))
    expect(screen.getByRole("alertdialog")).toBeVisible()
    expect(screen.getByText("Cancel")).toHaveFocus()
    await user.keyboard("{Escape}")
    expect(confirm).not.toHaveBeenCalled()
    await waitFor(() => expect(screen.getByText("Archive")).toHaveFocus())
  })
  it("selects calendar dates and respects disabled days", async () => {
    const selected = vi.fn()
    render(<Calendar mode="single" defaultMonth={new Date(2026, 8, 1)} disabled={{ before: new Date(2026, 8, 10) }} onSelect={selected} />)
    expect(screen.getByRole("button", { name: /September 9th/ })).toBeDisabled()
    await userEvent.click(screen.getByRole("button", { name: /September 15th/ }))
    expect(selected.mock.calls[0]?.[0]).toEqual(new Date(2026, 8, 15))
  })
  it("edits radio and slider values with arrow keys", async () => {
    const user = userEvent.setup()
    const changed = vi.fn()
    render(
      <>
        <RadioGroup defaultValue="a" aria-label="Frequency">
          <label htmlFor="frequency-a">
            <RadioGroupItem id="frequency-a" value="a" />
            Daily
          </label>
          <label htmlFor="frequency-b">
            <RadioGroupItem id="frequency-b" value="b" />
            Weekly
          </label>
        </RadioGroup>
        <Slider aria-label="Volume" defaultValue={[35]} onValueChange={changed} />
      </>,
    )
    await user.tab()
    await user.keyboard("{ArrowDown>}")
    await waitFor(() => expect(screen.getByRole("radio", { name: "Weekly" })).toBeChecked())
    await user.keyboard("{/ArrowDown}")
    await user.tab()
    await user.keyboard("{ArrowRight}")
    expect(changed).toHaveBeenCalledWith([36])
  })
  it("prevents duplicate tags and removes a selected tag", async () => {
    const user = userEvent.setup()
    function Demo() {
      const [value, setValue] = useState(["AI"])
      return <TagInput value={value} onValueChange={setValue} />
    }
    render(<Demo />)
    const input = screen.getByRole("textbox")
    await user.type(input, "AI{Enter}Design{Enter}")
    expect(screen.getAllByRole("button", { name: "Remove AI" })).toHaveLength(1)
    await user.click(screen.getByRole("button", { name: "Remove AI" }))
    expect(screen.queryByRole("button", { name: "Remove AI" })).toBeNull()
    expect(screen.getByRole("button", { name: "Remove Design" })).toBeVisible()
  })
  it("accepts pasted OTP digits without accepting letters", async () => {
    const user = userEvent.setup()
    function Demo() {
      const [value, setValue] = useState("")
      return <InputOTP value={value} onValueChange={setValue} />
    }
    render(<Demo />)
    await user.click(screen.getByRole("textbox"))
    await user.paste("12a345")
    expect(screen.getByRole("textbox")).toHaveValue("12345")
    await user.type(screen.getByRole("textbox"), "6")
    expect(screen.getByRole("textbox")).toHaveValue("123456")
  })
  it("rejects oversized file selection before passing it to the caller", async () => {
    const changed = vi.fn()
    render(<FileUpload maxBytes={2} onFilesChange={changed} />)
    await userEvent.upload(screen.getByLabelText("Choose files"), new File(["long"], "notes.txt", { type: "text/plain" }))
    expect(changed).not.toHaveBeenCalled()
    expect(screen.getByRole("alert")).toBeVisible()
  })
  it("requires an answer and preserves answers when navigating back", async () => {
    const user = userEvent.setup()
    const complete = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(undefined)
    render(
      <Questionnaire
        questions={[
          { id: "type", title: "Choose type", type: "single", options: [{ value: "cards", label: "Cards" }] },
          {
            id: "tags",
            title: "Choose labels",
            type: "multiple",
            options: [
              { value: "ai", label: "AI" },
              { value: "ui", label: "UI" },
            ],
          },
        ]}
        onComplete={complete}
      />,
    )
    expect(screen.getByText("Next")).toBeDisabled()
    await user.click(screen.getByLabelText("Cards"))
    await user.click(screen.getByText("Next"))
    await user.click(screen.getByLabelText("AI"))
    await user.click(screen.getByLabelText("UI"))
    await user.click(screen.getByText("Previous"))
    expect(screen.getByLabelText("Cards")).toBeChecked()
    await user.click(screen.getByText("Next"))
    expect(screen.getByLabelText("AI")).toBeChecked()
    await user.click(screen.getByText("Submit"))
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not submit")
    await user.click(screen.getByText("Submit"))
    expect(await screen.findByRole("status")).toHaveTextContent("Answers submitted")
    expect(complete).toHaveBeenLastCalledWith({ type: "cards", tags: ["ai", "ui"] })
  })
  it("bounds carousel navigation and handles changing slide counts", async () => {
    const { rerender } = render(<Carousel items={["First", "Second"]} />)
    expect(screen.getByText("Previous")).toBeDisabled()
    await userEvent.click(screen.getByText("Next"))
    expect(screen.getByText("Second")).toBeVisible()
    expect(screen.getByText("Next")).toBeDisabled()
    rerender(<Carousel items={[]} />)
    expect(screen.getByText("No slides.")).toBeVisible()
    expect(screen.getByText("Next")).toBeDisabled()
  })
  it("separates task opening from status changes", async () => {
    const open = vi.fn(),
      move = vi.fn()
    render(
      <TaskCard
        title="Review"
        onOpen={open}
        status="ready"
        columns={[
          { value: "ready", label: "Ready" },
          { value: "done", label: "Done" },
        ]}
        onStatusChange={move}
      />,
    )
    await userEvent.selectOptions(screen.getByRole("combobox"), "done")
    expect(move).toHaveBeenCalledWith("done")
    expect(open).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole("button", { name: "Review" }))
    expect(open).toHaveBeenCalledOnce()
  })
})

describe("chart data and accessibility", () => {
  it("keeps signed values available and never generates invalid geometry", () => {
    const { container } = render(
      <Chart
        label="Balance"
        data={[
          { label: "Loss", value: -5 },
          { label: "Gain", value: 10 },
          { label: "Invalid", value: NaN },
        ]}
        kind="bar"
      />,
    )
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/)
    expect(screen.getByRole("img", { name: "Balance" })).toBeVisible()
    expect(container.querySelectorAll("rect")).toHaveLength(2)
    expect(container.querySelector("table")?.textContent).toContain("Loss-5")
  })
  it("shows no-data for empty shares and clamps gauge geometry", () => {
    const { rerender, container } = render(<Chart label="Devices" data={[{ label: "Desktop", value: 0 }]} kind="donut" />)
    expect(screen.getByRole("status")).toHaveTextContent("No data")
    rerender(<Chart label="Scores" data={[{ label: "Quality", value: 140 }]} kind="gauge" />)
    expect(screen.getByRole("img", { name: "Quality: 100 of 100" })).toBeVisible()
    expect(container.querySelector("table")?.textContent).toContain("140")
  })
  it("exposes labeled cards and chart alternatives without accessibility violations", async () => {
    const { container } = render(
      <main>
        <h1>Examples</h1>
        <h2>Cards and charts</h2>
        <TaskCard title="Review" description="Check output" labels={["AI"]} />
        <Chart
          label="Visits"
          kind="line"
          data={[
            { label: "Mon", value: 5 },
            { label: "Tue", value: 10 },
          ]}
        />
      </main>,
    )
    const result = await axe.run(container, { rules: { "color-contrast": { enabled: false } } })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})
