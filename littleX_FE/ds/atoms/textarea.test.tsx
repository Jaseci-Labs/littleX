"use client"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("renders correctly with default props", () => {
    render(<Textarea />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass("flex min-h-[80px] w-full rounded-md border")
  })

  it("renders with placeholder text", () => {
    render(<Textarea placeholder="Enter text" />)
    const textarea = screen.getByPlaceholderText("Enter text")
    expect(textarea).toBeInTheDocument()
  })

  it("renders as disabled when disabled prop is true", () => {
    render(<Textarea disabled />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toBeDisabled()
  })

  it("applies custom className", () => {
    render(<Textarea className="custom-class" />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveClass("custom-class")
  })

  it("handles user input correctly", async () => {
    render(<Textarea />)
    const textarea = screen.getByRole("textbox")

    await userEvent.type(textarea, "Hello, world!")
    expect(textarea).toHaveValue("Hello, world!")
  })

  it("calls onChange when textarea value changes", async () => {
    const handleChange = jest.fn()
    render(<Textarea onChange={handleChange} />)

    await userEvent.type(screen.getByRole("textbox"), "a")
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("renders with specified number of rows", () => {
    render(<Textarea rows={10} />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveAttribute("rows", "10")
  })

  it("renders as read-only when readOnly prop is true", () => {
    render(<Textarea readOnly value="Read-only content" />)
    const textarea = screen.getByRole("textbox")
    expect(textarea).toHaveAttribute("readonly")
    expect(textarea).toHaveValue("Read-only content")
  })

  it("forwards ref to the textarea element", () => {
    const ref = jest.fn()
    render(<Textarea ref={ref} />)
    expect(ref).toHaveBeenCalled()
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement)
  })
})

