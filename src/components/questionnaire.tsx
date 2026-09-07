"use client"

import * as React from "react"
import { Button } from "./button.js"
import { Input } from "./input.js"
export type Question = {
  id: string
  title: string
  description?: string
  type: "single" | "multiple" | "text"
  options?: { value: string; label: string }[]
  optional?: boolean
}
export type Answers = Record<string, string | string[]>
export function Questionnaire({
  questions,
  onComplete,
}: {
  questions: Question[]
  onComplete: (answers: Answers) => void | Promise<void>
}) {
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Answers>({})
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState("")
  const [done, setDone] = React.useState(false)
  const prefix = React.useId()
  const question = questions[step]
  if (done)
    return (
      <p role="status" className="rounded-xl border border-border bg-card p-5 text-body">
        Answers submitted.
      </p>
    )
  if (!question) return <p>No questions.</p>
  const answer = answers[question.id]
  const valid = question.optional || (typeof answer === "string" ? answer.trim().length > 0 : Array.isArray(answer) && answer.length > 0)
  const set = (value: string | string[]) => setAnswers({ ...answers, [question.id]: value })
  const finish = async () => {
    setPending(true)
    setError("")
    try {
      await onComplete(answers)
      setDone(true)
    } catch {
      setError("Could not submit. Please try again.")
    } finally {
      setPending(false)
    }
  }
  return (
    <form
      className="space-y-4 rounded-xl border border-border bg-card p-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (!valid || pending) return
        if (step === questions.length - 1) void finish()
        else setStep(step + 1)
      }}
    >
      <p className="font-code text-micro text-muted-foreground" aria-live="polite">
        Question {step + 1} of {questions.length}
      </p>
      <fieldset key={question.id} disabled={pending} className="space-y-3">
        <legend className="mb-2 font-body text-lead">{question.title}</legend>
        {question.description && <p className="text-body text-muted-foreground">{question.description}</p>}
        {question.type === "text" ? (
          <Input
            aria-label={question.title}
            value={typeof answer === "string" ? answer : ""}
            onChange={(e) => set(e.target.value)}
            required={!question.optional}
          />
        ) : (
          question.options?.map((option) => (
            <label key={option.value} className="flex items-center gap-3 rounded-md border border-border p-3 text-body">
              <input
                className="accent-primary"
                type={question.type === "multiple" ? "checkbox" : "radio"}
                name={`${prefix}-${question.id}`}
                value={option.value}
                checked={question.type === "multiple" ? Array.isArray(answer) && answer.includes(option.value) : answer === option.value}
                onChange={(e) => {
                  if (question.type === "single") set(option.value)
                  else {
                    const selected = Array.isArray(answer) ? answer : []
                    set(e.target.checked ? [...selected, option.value] : selected.filter((v) => v !== option.value))
                  }
                }}
              />
              {option.label}
            </label>
          ))
        )}
      </fieldset>
      {error && (
        <p role="alert" className="text-body text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={!step || pending} onClick={() => setStep(step - 1)}>
          Previous
        </Button>
        {question.optional && step < questions.length - 1 && (
          <Button type="button" variant="ghost" disabled={pending} onClick={() => setStep(step + 1)}>
            Skip
          </Button>
        )}
        <Button type="submit" disabled={!valid || pending} loading={pending}>
          {step === questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </form>
  )
}
