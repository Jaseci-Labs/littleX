"use client"

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Input } from "./input"

describe("Input", () => {
  it("renders correctly with default props", () => {
    render(<Input />)
    const input = screen.getByRole("textbox")
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass("flex h-10 w-full rounded-md border")
  })

  it("renders with placeholder text", () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText("Enter text")
    expect(input).toBeInTheDocument()
  })

  it("renders as disabled when disabled prop is true", () => {
    render(<Input disabled />)
    const input = screen.getByRole("textbox")
    expect(input).toBeDisabled()
  })

  it("applies custom className", () => {
    render(<Input className="custom-class" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("custom-class")
  })

  it("handles user input correctly", async () => {
    render(<Input />)
    const input = screen.getByRole("textbox")

    await userEvent.type(input, "Hello, world!")
    expect(input).toHaveValue("Hello, world!")
  })

  it("calls onChange when input value changes", async () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)

    await userEvent.type(screen.getByRole("textbox"), "a")
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("renders with different types", () => {
    const { rerender } = render(<Input type="text" />)
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text")

    rerender(<Input type="email" />)
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email")

    rerender(<Input type="password" />)
    // Note: password inputs don't have the "textbox" role
    expect(screen.getByDisplayValue("")).toHaveAttribute("type", "password")

    rerender(<Input type="number" />)
    // Note: number inputs don't have the "textbox" role
    expect(screen.getByDisplayValue("")).toHaveAttribute("type", "number")
  })

  it("forwards ref to the input element", () => {
    const ref = jest.fn()
    render(<Input ref={ref} />)
    expect(ref).toHaveBeenCalled()
    expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement)
  })
})

